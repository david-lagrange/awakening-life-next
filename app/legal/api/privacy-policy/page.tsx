import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon,
  CodeBracketIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'API Privacy Policy | Awakening Life',
  description: 'Privacy policy for developers using the Awakening Life API, detailing how API data is collected, used, and protected.',
  keywords: ['API Privacy', 'Developer Privacy', 'Awakening Life API', 'Data Protection', 'API Security'],
  openGraph: {
    title: 'API Privacy Policy | Awakening Life',
    description: 'Privacy policy for developers using the Awakening Life API, detailing how API data is collected, used, and protected.',
    url: 'https://awakeninglife.com/legal/api/privacy-policy',
    type: 'website',
  },
};

// Section header component
function SectionHeader({ 
  title, 
  icon 
}: { 
  title: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900/30 mr-3">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}

export default function APIPrivacyPolicy() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/3"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            API Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mr-2.5 mt-0.5" aria-hidden="true">
                <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">API Access Restricted</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  The Awakening Life API is currently not available for public use. This privacy policy will apply when API access becomes available.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This API Privacy Policy (&quot;API Privacy Policy&quot;) describes how Awakening Life collects, uses, and shares information in connection with your use of our 
            application programming interface and related documentation (collectively, the &quot;API&quot;). This API Privacy Policy applies to developers and entities who 
            access or use our API.
          </p>
          
          <div className="space-y-8">
            <section>
              <SectionHeader 
                title="1. Information We Collect" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-medium">Developer Information</p>
                <p>
                  When you register for API access, we collect information about you and your organization, including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Organization name and website</li>
                  <li>Developer credentials and authentication information</li>
                  <li>Payment information (if applicable)</li>
                </ul>
                
                <p className="font-medium mt-6">API Usage Information</p>
                <p>
                  We collect information about your use of the API, including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>API requests, including timestamps, endpoints accessed, and parameters</li>
                  <li>IP addresses and device information</li>
                  <li>Performance metrics and error logs</li>
                  <li>Usage patterns and statistics</li>
                </ul>
                
                <p className="font-medium mt-6">End User Information</p>
                <p>
                  Through your integration with our API, you may provide us with information about your end users. This may include:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>User identifiers and authentication tokens</li>
                  <li>Content and communications shared during guided sessions</li>
                  <li>User preferences and settings</li>
                </ul>
                <p>
                  You are responsible for obtaining all necessary consents from your end users for the collection and processing of their information 
                  through your integration with our API.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="2. How We Use Information" 
                icon={<ServerIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Providing and Improving the API:</span> To operate, maintain, and enhance the API and related services.</li>
                  <li><span className="font-medium">Security and Compliance:</span> To monitor API usage, prevent abuse, and ensure compliance with our terms and policies.</li>
                  <li><span className="font-medium">Analytics and Reporting:</span> To analyze usage patterns, generate statistics, and create reports on API performance and adoption.</li>
                  <li><span className="font-medium">Communication:</span> To communicate with you about your API access, updates, and related services.</li>
                  <li><span className="font-medium">Support:</span> To provide technical support and respond to your inquiries.</li>
                </ul>
                
                <p className="mt-4">
                  End user information accessed through the API is used to provide the requested functionality to your integration and to ensure 
                  the security and integrity of our services.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="3. Special Considerations for Self-Realization Content" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Given the personal and sensitive nature of self-realization journeys, we apply additional protections to content related to 
                  contemplation, mind clearing, deepest vision, and other guided sessions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We limit API access to self-realization content to approved integrations that demonstrate a clear value proposition and strong privacy practices</li>
                  <li>We require explicit user consent for any access to or processing of self-realization content through the API</li>
                  <li>We implement additional security measures for API endpoints that access sensitive content</li>
                </ul>
                
                <p className="mt-4">
                  As an API developer, you must handle self-realization content with the utmost care and respect for user privacy. You must not use 
                  such content for purposes beyond those explicitly authorized by the end user.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="4. Information Sharing and Disclosure" 
                icon={<GlobeAltIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We do not sell your information or end user information accessed through the API. We may share information in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Service Providers:</span> We may share information with trusted third-party service providers who assist us in operating, securing, and improving the API.</li>
                  <li><span className="font-medium">Legal Requirements:</span> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
                  <li><span className="font-medium">Business Transfers:</span> If Awakening Life is involved in a merger, acquisition, or sale of assets, information related to the API may be transferred as part of that transaction.</li>
                  <li><span className="font-medium">Protection of Rights:</span> We may share information to protect the rights, property, or safety of Awakening Life, our users, or others.</li>
                </ul>
                
                <p className="mt-4">
                  Any sharing of information is subject to appropriate confidentiality and security measures.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="5. Data Security" 
                icon={<LockClosedIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We implement appropriate technical and organizational measures to protect the security, integrity, and confidentiality of information 
                  associated with the API:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Encryption of data in transit using TLS/SSL</li>
                  <li>Secure authentication mechanisms for API access</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and monitoring systems</li>
                  <li>Incident response procedures</li>
                </ul>
                
                <p className="mt-4">
                  As an API developer, you are responsible for implementing appropriate security measures in your integration to protect any data 
                  accessed through the API. This includes securing API credentials, implementing proper authentication and authorization, and 
                  encrypting sensitive data.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="6. Developer Obligations" 
                icon={<CodeBracketIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  As an API developer, you have certain obligations regarding the handling of information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You must comply with all applicable privacy laws and regulations</li>
                  <li>You must provide a clear and accurate privacy policy that discloses how you collect, use, and share information obtained through the API</li>
                  <li>You must obtain appropriate consent from end users before accessing their information through the API</li>
                  <li>You must implement reasonable security measures to protect information accessed through the API</li>
                  <li>You must promptly notify us of any unauthorized access to or disclosure of information</li>
                  <li>You must delete end user information upon request or when no longer needed</li>
                </ul>
                
                <p className="mt-4">
                  Failure to meet these obligations may result in suspension or termination of your API access.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="7. Data Retention" 
                icon={<ClockIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We retain information associated with the API for as long as necessary to fulfill the purposes outlined in this API Privacy Policy, 
                  unless a longer retention period is required or permitted by law.
                </p>
                <p>
                  Developer information is retained for as long as you maintain an active API account. If you delete your API account, we will delete 
                  or anonymize your information within 30 days, except for information that we are required to retain for legal or legitimate business purposes.
                </p>
                <p>
                  API usage information may be retained for a longer period for security, analytics, and service improvement purposes, but will be 
                  anonymized when possible.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="8. International Data Transfers" 
                icon={<GlobeAltIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Information associated with the API may be transferred to and processed in countries other than the country in which you are located. 
                  These countries may have data protection laws that differ from those in your country.
                </p>
                <p>
                  When we transfer information to other countries, we implement appropriate safeguards to ensure that your information receives 
                  adequate protection, including standard contractual clauses approved by relevant regulatory authorities.
                </p>
                <p>
                  As an API developer, you are responsible for ensuring that any international transfers of information accessed through the API 
                  comply with applicable data protection laws.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="9. Changes to This API Privacy Policy" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may update this API Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. 
                  We will notify you of any material changes by posting the updated API Privacy Policy on our website and, where appropriate, sending you a notification.
                </p>
                <p>
                  Your continued use of the API after the effective date of the updated API Privacy Policy constitutes your acceptance of the updated terms.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="10. API Analytics and Monitoring" 
                icon={<ServerIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use various analytics and monitoring tools to track API usage, performance, and security:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We monitor API requests to detect and prevent abuse, ensure compliance with rate limits, and identify potential security issues</li>
                  <li>We analyze usage patterns to improve API performance, identify popular features, and guide future development</li>
                  <li>We track error rates and performance metrics to maintain service quality</li>
                </ul>
                
                <p className="mt-4">
                  This monitoring is essential for maintaining the security, reliability, and quality of our API services. The information collected 
                  through monitoring is used solely for these purposes and is not shared with third parties except as described in this API Privacy Policy.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="11. Your Rights and Choices" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  As an API developer, you have certain rights regarding your information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Access and Update:</span> You can access and update your developer information through your API dashboard.</li>
                  <li><span className="font-medium">Data Portability:</span> You can request a copy of your developer information in a structured, commonly used, and machine-readable format.</li>
                  <li><span className="font-medium">Deletion:</span> You can request deletion of your API account and associated information.</li>
                  <li><span className="font-medium">Objection:</span> You can object to our processing of your information in certain circumstances.</li>
                </ul>
                
                <p className="mt-4">
                  To exercise these rights, please contact us at api-privacy@awakeninglife.com. We will respond to your request within 
                  the timeframe required by applicable law.
                </p>
                <p>
                  Please note that certain information may be retained even after deletion of your API account for legal, security, or business purposes.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="12. Contact Us" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  If you have any questions, concerns, or requests regarding this API Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="font-medium">
                  api-privacy@awakeninglife.com
                </p>
                <p>
                  We are committed to working with you to obtain a fair resolution of any complaint or concern about privacy.
                </p>
              </div>
            </section>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Return to Home
          </Link>
          <Link 
            href="/legal/api/terms-of-service" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            API Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
} 