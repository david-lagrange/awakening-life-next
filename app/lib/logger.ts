import { CloudWatchLogs, PutLogEventsCommand, CreateLogGroupCommand, CreateLogStreamCommand, DescribeLogStreamsCommand } from '@aws-sdk/client-cloudwatch-logs';

console.log('Environment variables:', {
  CLOUDWATCH_LOG_GROUP: process.env.CLOUDWATCH_LOG_GROUP,
  CUSTOM_NODE_ENV: process.env.CUSTOM_NODE_ENV,
  AL_AWS_REGION: process.env.AL_AWS_REGION
});

// Define types for better error handling
type CloudWatchError = {
  name: string;
  message: string;
  expectedSequenceToken?: string;
};

type LogData = Record<string, unknown>;

// CloudWatch configuration
const logGroupName = process.env.CLOUDWATCH_LOG_GROUP || '/aws/amplify/awakening-life-next';
const logStreamName = process.env.CLOUDWATCH_LOG_STREAM || 
  `${process.env.CUSTOM_NODE_ENV}-logs-${new Date().toISOString().split('T')[0]}`;

// Create AWS CloudWatch client for all environments
let cloudWatchClient: CloudWatchLogs | null = null;
let sequenceToken: string | undefined = undefined;
let logStreamInitialized = false;

// Initialize CloudWatch client regardless of environment
try {
  // Check if we're running in Amplify using multiple indicators
  const isAmplify = 
    process.env.AWS_EXECUTION_ENV?.includes('AWS_Amplify') || 
    process.env.AWS_LAMBDA_FUNCTION_NAME?.includes('amplify') ||
    process.env._HANDLER !== undefined; // Lambda indicator
  
  console.log('Environment detection:', {
    AWS_EXECUTION_ENV: process.env.AWS_EXECUTION_ENV,
    AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME,
    _HANDLER: process.env._HANDLER,
    isAmplify
  });
  
  // Use explicit credentials from custom environment variables
  cloudWatchClient = new CloudWatchLogs({
    region: process.env.AL_AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AL_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AL_AWS_SECRET_ACCESS_KEY || ''
    }
  });
  
  console.log('CloudWatch client initialized with configuration:', { 
    region: process.env.AL_AWS_REGION || 'us-east-1',
    usingExplicitCredentials: true,
    hasAccessKey: !!process.env.AL_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AL_AWS_SECRET_ACCESS_KEY
  });
} catch (error) {
  console.error('Failed to initialize CloudWatch client:', error);
}

// Initialize the log group and stream
const initializeLogStream = async (): Promise<void> => {
  if (!cloudWatchClient || logStreamInitialized) return;
  
  try {
    // Create log group if it doesn't exist
    try {
      await cloudWatchClient.send(new CreateLogGroupCommand({ 
        logGroupName 
      }));
      console.log(`Created CloudWatch log group: ${logGroupName}`);
    } catch (error: unknown) {
      // Ignore if the log group already exists
      const cwError = error as CloudWatchError;
      if (cwError.name !== 'ResourceAlreadyExistsException') {
        console.error('Error creating CloudWatch log group:', error);
      }
    }
    
    // Create log stream if it doesn't exist
    try {
      await cloudWatchClient.send(new CreateLogStreamCommand({ 
        logGroupName, 
        logStreamName 
      }));
      console.log(`Created CloudWatch log stream: ${logStreamName}`);
    } catch (error: unknown) {
      // Ignore if the log stream already exists
      const cwError = error as CloudWatchError;
      if (cwError.name !== 'ResourceAlreadyExistsException') {
        console.error('Error creating CloudWatch log stream:', error);
      }
    }
    
    // Get the sequence token for the log stream
    try {
      const response = await cloudWatchClient.send(new DescribeLogStreamsCommand({
        logGroupName,
        logStreamNamePrefix: logStreamName
      }));
      
      const logStream = response.logStreams?.find(stream => stream.logStreamName === logStreamName);
      if (logStream) {
        sequenceToken = logStream.uploadSequenceToken;
      }
    } catch (error) {
      console.error('Error getting CloudWatch sequence token:', error);
    }
    
    logStreamInitialized = true;
  } catch (error) {
    console.error('Failed to initialize CloudWatch logging:', error);
  }
};

// Initialize log stream for all environments
if (cloudWatchClient) {
  initializeLogStream().catch(console.error);
}

// Helper function to redact sensitive information
const redactSensitiveInfo = (data: LogData): LogData => {
  const sensitiveKeys = ['accessToken', 'refreshToken', 'password', 'token'];
  const redactedData = { ...data };
  
  const redactObject = (obj: Record<string, unknown>): void => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        redactObject(obj[key] as Record<string, unknown>);
      } else if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        obj[key] = '[REDACTED]';
      }
    }
  };
  
  redactObject(redactedData);
  return redactedData;
};

// Function to send logs to CloudWatch
const sendToCloudWatch = async (level: string, message: string, data: LogData = {}): Promise<void> => {
  if (!cloudWatchClient) return;
  
  try {
    // Make sure log stream is initialized
    if (!logStreamInitialized) {
      try {
        await initializeLogStream();
      } catch (error) {
        // If initialization fails, disable CloudWatch logging to prevent repeated errors
        console.error('Failed to initialize CloudWatch logging, disabling CloudWatch:', error);
        cloudWatchClient = null;
        return;
      }
    }
    
    // Redact sensitive information
    const safeData = redactSensitiveInfo(data);
    
    // Check if we need to create a new log stream for a new day
    const currentDate = new Date().toISOString().split('T')[0];
    const expectedStreamName = `${process.env.CUSTOM_NODE_ENV}-logs-${currentDate}`;
    
    if (logStreamName !== expectedStreamName) {
      // We need a new log stream for the new day
      const newLogStreamName = expectedStreamName;
      
      try {
        await cloudWatchClient.send(new CreateLogStreamCommand({ 
          logGroupName, 
          logStreamName: newLogStreamName
        }));
        console.log(`Created new CloudWatch log stream for new day: ${newLogStreamName}`);
        
        // Update the global variables - using type assertion to modify the const
        (logStreamName as unknown as string) = newLogStreamName;
        sequenceToken = undefined;
      } catch (error: unknown) {
        // Ignore if the log stream already exists
        const cwError = error as CloudWatchError;
        if (cwError.name !== 'ResourceAlreadyExistsException') {
          console.error('Error creating new CloudWatch log stream for new day:', error);
        }
      }
    }
    
    // Add environment and hostname info to logs
    const enhancedData = {
      ...safeData,
      environment: process.env.CUSTOM_NODE_ENV || 'development',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
    };
    
    // Prepare the log event
    const logEvent = {
      timestamp: Date.now(),
      message: JSON.stringify({
        level,
        msg: message,
        ...enhancedData,
        timestamp: new Date().toISOString()
      })
    };
    
    // Send the log event to CloudWatch
    const command = new PutLogEventsCommand({
      logGroupName,
      logStreamName,
      logEvents: [logEvent],
      sequenceToken
    });
    
    const response = await cloudWatchClient.send(command);
    
    // Update the sequence token for the next log event
    sequenceToken = response.nextSequenceToken;
  } catch (error: unknown) {
    const cwError = error as CloudWatchError;
    if (cwError.name === 'InvalidSequenceTokenException' && cwError.expectedSequenceToken) {
      sequenceToken = cwError.expectedSequenceToken;
      await sendToCloudWatch(level, message, data);
    } else if (cwError.name === 'CredentialsProviderError') {
      // If we have credential issues, disable CloudWatch to prevent repeated errors
      console.error('CloudWatch credentials error, disabling CloudWatch logging:', cwError.message);
      cloudWatchClient = null;
    } else {
      console.error('Failed to send log to CloudWatch:', error);
    }
  }
};

// Format console logs for better readability in development
const formatConsoleLog = (level: string, message: string, data: LogData = {}): string => {
  const timestamp = new Date().toISOString();
  const safeData = redactSensitiveInfo(data);
  
  if (process.env.CUSTOM_NODE_ENV === 'production') {
    // In production, just log JSON for Amplify to capture
    return JSON.stringify({ level, msg: message, ...safeData, timestamp });
  } else {
    // In development, format for readability
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(safeData).length ? JSON.stringify(safeData, null, 2) : ''}`;
  }
};

// Define the Logger interface for better type safety
interface Logger {
  debug(message: string, data?: LogData): void;
  info(message: string, data?: LogData): void;
  warn(message: string, data?: LogData): void;
  error(message: string, data?: LogData): void;
  child(bindings: LogData): Logger;
}

// Create a custom logger that logs to console and CloudWatch in all environments
const logger: Logger = {
  debug: (message: string, data: LogData = {}) => {
    if (process.env.LOG_LEVEL === 'debug' || process.env.CUSTOM_NODE_ENV !== 'production') {
      console.debug(formatConsoleLog('debug', message, data));
    }
    sendToCloudWatch('debug', message, data).catch(err => 
      console.error('Failed to send debug log to CloudWatch:', err)
    );
  },
  info: (message: string, data: LogData = {}) => {
    console.info(formatConsoleLog('info', message, data));
    sendToCloudWatch('info', message, data).catch(err => 
      console.error('Failed to send info log to CloudWatch:', err)
    );
  },
  warn: (message: string, data: LogData = {}) => {
    console.warn(formatConsoleLog('warn', message, data));
    sendToCloudWatch('warn', message, data).catch(err => 
      console.error('Failed to send warn log to CloudWatch:', err)
    );
  },
  error: (message: string, data: LogData = {}) => {
    console.error(formatConsoleLog('error', message, data));
    sendToCloudWatch('error', message, data).catch(err => 
      console.error('Failed to send error log to CloudWatch:', err)
    );
  },
  child: (bindings: LogData) => {
    return {
      debug: (message: string, data: LogData = {}) => {
        if (process.env.LOG_LEVEL === 'debug' || process.env.CUSTOM_NODE_ENV !== 'production') {
          console.debug(formatConsoleLog('debug', message, { ...bindings, ...data }));
        }
        sendToCloudWatch('debug', message, { ...bindings, ...data }).catch(err => 
          console.error('Failed to send debug log to CloudWatch:', err)
        );
      },
      info: (message: string, data: LogData = {}) => {
        console.info(formatConsoleLog('info', message, { ...bindings, ...data }));
        sendToCloudWatch('info', message, { ...bindings, ...data }).catch(err => 
          console.error('Failed to send info log to CloudWatch:', err)
        );
      },
      warn: (message: string, data: LogData = {}) => {
        console.warn(formatConsoleLog('warn', message, { ...bindings, ...data }));
        sendToCloudWatch('warn', message, { ...bindings, ...data }).catch(err => 
          console.error('Failed to send warn log to CloudWatch:', err)
        );
      },
      error: (message: string, data: LogData = {}) => {
        console.error(formatConsoleLog('error', message, { ...bindings, ...data }));
        sendToCloudWatch('error', message, { ...bindings, ...data }).catch(err => 
          console.error('Failed to send error log to CloudWatch:', err)
        );
      },
      child: (nestedBindings: LogData) => {
        return logger.child({ ...bindings, ...nestedBindings });
      }
    };
  }
};

// Helper to create component-specific loggers
export const createLogger = (component: string, context: LogData = {}): Logger => {
  return logger.child({ component, ...context });
};

// Default export for simpler imports
export default logger; 