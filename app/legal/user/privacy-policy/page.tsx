import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Privacy Policy | Awakening Life',
  description: 'Learn how Awakening Life collects, uses, and protects your personal information during your self-realization journey.',
  keywords: ['Privacy Policy', 'Data Protection', 'Awakening Life', 'Personal Information', 'Data Security'],
  openGraph: {
    title: 'Privacy Policy | Awakening Life',
    description: 'Learn how Awakening Life collects, uses, and protects your personal information during your self-realization journey.',
    url: 'https://awakeninglife.com/legal/user/privacy-policy',
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

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/3"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            At Awakening Life, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          
          <div className="space-y-8">
            <section>
              <SectionHeader 
                title="1. Information We Collect" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-medium">Personal Information</p>
                <p>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create an account (email address, password)</li>
                  <li>Update your profile (name, profile picture)</li>
                  <li>Subscribe to our services (payment information, billing address)</li>
                  <li>Contact our support team (communication records)</li>
                </ul>
                
                <p className="font-medium mt-6">Session Data</p>
                <p>
                  During your guided sessions, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Content and communications you share during sessions</li>
                  <li>Insights, realizations, and goals you identify</li>
                  <li>Session preferences and settings</li>
                </ul>
                
                <p className="font-medium mt-6">Usage Information</p>
                <p>
                  We automatically collect certain information about your device and how you interact with our platform:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location information</li>
                  <li>Usage patterns and preferences</li>
                  <li>Log data and analytics information</li>
                </ul>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="2. How We Use Your Information" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Providing and personalizing our services to enhance your self-realization journey</li>
                  <li>Processing transactions and managing your subscription</li>
                  <li>Improving and developing our platform based on user feedback and usage patterns</li>
                  <li>Communicating with you about your account, updates, and new features</li>
                  <li>Analyzing usage trends to optimize user experience</li>
                  <li>Protecting our services and users from fraudulent or harmful activities</li>
                </ul>
                
                <p className="mt-4">
                  Your session data is primarily used to provide personalized guidance and track your progress. We may use anonymized 
                  and aggregated data from sessions to improve our AI models and enhance the effectiveness of our guidance.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="3. AI Training and Data Processing" 
                icon={<GlobeAltIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Awakening Life uses artificial intelligence to provide personalized guidance. To improve our AI capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We may use anonymized session data to train and refine our AI models</li>
                  <li>Personal identifiers are removed before any data is used for training purposes</li>
                  <li>We implement technical safeguards to ensure the privacy and security of your data during processing</li>
                </ul>
                
                <p className="mt-4">
                  You can opt out of having your data used for AI training by adjusting your privacy settings in your account 
                  or by contacting our support team.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="4. Data Sharing and Disclosure" 
                icon={<UserGroupIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We do not sell your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Service Providers:</span> We may share information with trusted third-party service providers who assist us in operating our platform, processing payments, and analyzing usage data. These providers are contractually obligated to protect your information.</li>
                  <li><span className="font-medium">Business Transfers:</span> If Awakening Life is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                  <li><span className="font-medium">Legal Requirements:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                  <li><span className="font-medium">Protection of Rights:</span> We may share information to protect the rights, property, or safety of Awakening Life, our users, or others.</li>
                </ul>
                
                <p className="mt-4">
                  We limit the information we share to what is necessary for the specific purpose and ensure appropriate safeguards are in place.
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
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and vulnerability testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection and privacy practices</li>
                </ul>
                
                <p className="mt-4">
                  While we strive to use commercially acceptable means to protect your personal information, no method of transmission over 
                  the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="6. Data Retention" 
                icon={<ClockIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                  unless a longer retention period is required or permitted by law.
                </p>
                <p>
                  Account information is retained while your account is active. If you delete your account, we will delete or anonymize your 
                  personal information within 30 days, except for information that we are required to retain for legal or legitimate business purposes.
                </p>
                <p>
                  Session data may be retained for a longer period to provide you with insights into your progress over time. You can request 
                  deletion of specific session data through your account settings.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="7. Your Privacy Rights" 
                icon={<UserGroupIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Access:</span> You can request access to the personal information we hold about you.</li>
                  <li><span className="font-medium">Correction:</span> You can request that we correct inaccurate or incomplete information.</li>
                  <li><span className="font-medium">Deletion:</span> You can request that we delete your personal information in certain circumstances.</li>
                  <li><span className="font-medium">Restriction:</span> You can request that we restrict the processing of your information.</li>
                  <li><span className="font-medium">Data Portability:</span> You can request a copy of your information in a structured, commonly used, and machine-readable format.</li>
                  <li><span className="font-medium">Objection:</span> You can object to our processing of your information in certain circumstances.</li>
                </ul>
                
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@awakeninglife.com. We will respond to your request within 
                  the timeframe required by applicable law.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="8. Cookies and Tracking Technologies" 
                icon={<GlobeAltIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use cookies and similar tracking technologies to collect information about your browsing activities and to enhance your experience on our platform:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Essential Cookies:</span> Required for the platform to function properly.</li>
                  <li><span className="font-medium">Analytical Cookies:</span> Help us understand how users interact with our platform.</li>
                  <li><span className="font-medium">Functional Cookies:</span> Enable personalized features and remember your preferences.</li>
                  <li><span className="font-medium">Marketing Cookies:</span> Used to deliver relevant content and track the effectiveness of our marketing efforts.</li>
                </ul>
                
                <p className="mt-4">
                  You can manage your cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our platform.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="9. Children's Privacy" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Awakening Life is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. 
                  If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will take 
                  steps to delete such information.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="10. International Data Transfers" 
                icon={<GlobeAltIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have 
                  data protection laws that differ from those in your country.
                </p>
                <p>
                  When we transfer your information to other countries, we implement appropriate safeguards to ensure that your information receives 
                  adequate protection, including standard contractual clauses approved by relevant regulatory authorities.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="11. Changes to This Privacy Policy" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. 
                  We will notify you of any material changes by posting the updated Privacy Policy on our website and, where appropriate, sending you a notification.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="12. Special Considerations for Self-Realization Content" 
                icon={<ExclamationTriangleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Given the personal nature of self-realization journeys, we apply additional protections to the content you share during guided sessions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your personal insights, realizations, and experiences are treated with the highest level of confidentiality</li>
                  <li>Access to your session data is strictly limited to authorized personnel who need it to provide the service</li>
                  <li>When used for improving our AI models, your session data is thoroughly anonymized to remove any personally identifiable information</li>
                </ul>
                <p className="mt-4">
                  You maintain control over your session data and can request its deletion at any time through your account settings.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="13. Contact Us" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="font-medium">
                  privacy@awakeninglife.com
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
            href="/legal/user/terms-of-service" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}