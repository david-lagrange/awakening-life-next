import { Metadata } from 'next';
import Link from 'next/link';
import CreateAccountForm from '@/app/ui/auth/create-account-form';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Begin Your Journey | Awakening Life',
  description: 'Create your Awakening Life account and embark on a guided journey to total realization of self through AI-powered conversations.',
  keywords: ['Awakening Life', 'Self-Realization', 'Spiritual Growth', 'Create Account', 'Meditation', 'Contemplation', 'Mindfulness'],
  openGraph: {
    title: 'Begin Your Journey | Awakening Life',
    description: 'Create your Awakening Life account and embark on a guided journey to total realization of self through AI-powered conversations.',
    url: 'https://awakeninglife.com/auth/create-account',
    type: 'website',
    images: [{
      url: '/create-account-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Awakening Life - Begin Your Journey',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Begin Your Journey | Awakening Life',
    description: 'Create your Awakening Life account and embark on a guided journey to total realization of self through AI-powered conversations.',
    images: ['/create-account-og-image.jpg'],
  },
};

// Journey benefit component
function JourneyBenefit({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/2"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Begin Your <span className="text-blue-600 dark:text-blue-400">Awakening</span> Journey
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Create your account and unlock guided experiences that reveal your true nature and potential.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start md:items-stretch">
          {/* Left side - Benefits (reversed from previous layout) */}
          <div className="w-full md:w-auto md:min-w-[400px] md:max-w-[500px] md:flex md:flex-col order-2 md:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Journey Begins Here</h2>
              
              <div className="space-y-6">
                <JourneyBenefit 
                  title="Personalized Guidance" 
                  description="Experience AI conversations that adapt to your unique path of self-discovery and realization."
                  icon={<SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <JourneyBenefit 
                  title="Profound Contemplation" 
                  description="Explore koans that reveal your true nature through direct experience and guided inquiry."
                  icon={<LightBulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <JourneyBenefit 
                  title="Clarity & Purpose" 
                  description="Uncover your deepest visions and clear obstacles blocking your creative expression."
                  icon={<HeartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <JourneyBenefit 
                  title="Continuous Growth" 
                  description="Track your progress and insights as you deepen your self-awareness over time."
                  icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
              </div>
            </div>
          </div>
          
          {/* Right side - Form (reversed from previous layout) */}
          <div className="w-full md:w-auto md:min-w-[400px] md:flex md:flex-col order-1 md:order-2">
            <div className="flex-grow">
              <CreateAccountForm />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
