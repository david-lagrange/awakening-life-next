import { Metadata } from 'next';
import ContactForm from '@/app/ui/contact/contact-form';
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contact Us | Awakening Life',
  description: 'Reach out to the Awakening Life team with your questions, feedback, or inquiries about our guided self-realization journeys.',
  keywords: ['Contact Awakening Life', 'Self-Realization Support', 'Spiritual Guidance', 'Feedback', 'Questions', 'Inquiry'],
  openGraph: {
    title: 'Contact Us | Awakening Life',
    description: 'Reach out to the Awakening Life team with your questions, feedback, or inquiries about our guided self-realization journeys.',
    url: 'https://awakeninglife.ai/contact',
    type: 'website',
    images: [{
      url: '/contact-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Awakening Life - Contact Us',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Awakening Life',
    description: 'Reach out to the Awakening Life team with your questions, feedback, or inquiries about our guided self-realization journeys.',
    images: ['/contact-og-image.jpg'],
  },
};

// Contact reason component
function ContactReason({ 
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

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/2"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Connect With <span className="text-blue-600 dark:text-blue-400">Awakening Life</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We&apos;re here to support your journey to self-realization. Reach out with any questions or insights.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Left side - Contact Form */}
          <div className="w-full md:w-[calc(50%-16px)] order-2 md:order-1">
            <ContactForm />
          </div>
          
          {/* Right side - Contact Info */}
          <div className="w-full md:w-[calc(50%-16px)] order-1 md:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">How We Can Help</h2>
              
              <div className="space-y-6 flex-grow">
                <ContactReason 
                  title="Journey Support" 
                  description="Questions about your self-realization journey or technical support with our guided sessions."
                  icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <ContactReason 
                  title="Feedback & Insights" 
                  description="Share your experiences, insights, or suggestions to help us improve our guidance."
                  icon={<LightBulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <ContactReason 
                  title="Partnership Inquiries" 
                  description="Explore collaboration opportunities that align with our mission of self-realization."
                  icon={<HeartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
                <ContactReason 
                  title="General Questions" 
                  description="Any other inquiries about Awakening Life and our approach to consciousness."
                  icon={<EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                />
              </div>
              
              <div className="mt-6 md:mt-auto pt-6 border-t border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Connect With Us</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <a href="mailto:support@awakeninglife.ai" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                    support@awakeninglife.ai
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 