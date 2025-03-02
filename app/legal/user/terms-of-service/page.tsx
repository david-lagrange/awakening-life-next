import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ScaleIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Terms of Service | Awakening Life',
  description: 'Terms and conditions for using the Awakening Life platform for self-realization and guided AI sessions.',
  keywords: ['Terms of Service', 'Legal', 'Awakening Life', 'User Agreement', 'Terms and Conditions'],
  openGraph: {
    title: 'Terms of Service | Awakening Life',
    description: 'Terms and conditions for using the Awakening Life platform for self-realization and guided AI sessions.',
    url: 'https://awakeninglife.ai/legal/user/terms-of-service',
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

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/3"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Terms of <span className="text-blue-600 dark:text-blue-400">Service</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Awakening Life. These Terms of Service govern your use of our website, application, and services. 
            By accessing or using Awakening Life, you agree to be bound by these Terms. Please read them carefully.
          </p>
          
          <div className="space-y-8">
            <section>
              <SectionHeader 
                title="1. Acceptance of Terms" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  By accessing or using Awakening Life, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                  If you do not agree with any part of these terms, you may not use our services.
                </p>
                <p>
                  We may modify these Terms at any time. Your continued use of Awakening Life after any changes indicates your acceptance of the modified Terms.
                  We will make reasonable efforts to notify you of significant changes.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="2. Service Description" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Awakening Life provides AI-guided sessions designed to facilitate self-realization and personal growth. Our services include 
                  Contemplation, Mind Clearing, Deepest Vision, Manifestation, Gratitude and Goals, and Custom sessions.
                </p>
                <p>
                  Our services are intended for personal growth and self-discovery. They are not intended to replace professional medical, 
                  psychological, or psychiatric treatment. If you are experiencing mental health issues, please consult with a qualified healthcare provider.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="3. User Accounts" 
                icon={<UserGroupIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  To access certain features of Awakening Life, you may need to create an account. You are responsible for maintaining 
                  the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p>
                  You agree to provide accurate, current, and complete information during the registration process and to update such information 
                  to keep it accurate, current, and complete.
                </p>
                <p>
                  We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, outdated, or incomplete, 
                  or if we believe you have violated these Terms.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="4. User Conduct" 
                icon={<ExclamationTriangleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  You agree not to use Awakening Life for any purpose that is unlawful or prohibited by these Terms. You may not use our services in any 
                  manner that could damage, disable, overburden, or impair our servers or networks.
                </p>
                <p>
                  You agree not to attempt to access any part of our services, materials, or information through any means not intentionally made available 
                  through Awakening Life.
                </p>
                <p>
                  You understand that all information, data, text, or other materials that you provide during sessions (&quot;Content&quot;) are your sole responsibility. 
                  This means that you, not Awakening Life, are entirely responsible for all Content that you upload, post, or otherwise transmit via our services.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="5. Intellectual Property" 
                icon={<ScaleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Awakening Life and its original content, features, and functionality are owned by us and are protected by international copyright, 
                  trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
                <p>
                  You retain ownership of any Content you provide during sessions. By submitting Content, you grant us a worldwide, non-exclusive, 
                  royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your Content in any existing or future media 
                  for the purpose of providing and improving our services.
                </p>
                <p>
                  This license is solely for the purpose of operating and improving our services and will not be used to sell or distribute your Content 
                  to third parties without your explicit consent.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="6. Subscription and Payments" 
                icon={<ClockIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Some features of Awakening Life may require a paid subscription. By subscribing to our services, you agree to pay all fees 
                  associated with your subscription plan.
                </p>
                <p>
                  Subscription fees are billed in advance on a recurring basis, depending on the type of subscription plan you select. You can cancel 
                  your subscription at any time, but we do not provide refunds for the current billing period.
                </p>
                <p>
                  We reserve the right to change our subscription fees upon reasonable notice. Such notice may be provided at any time by posting the 
                  changes to the Awakening Life website or via email.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="7. Disclaimer of Warranties" 
                icon={<ExclamationTriangleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  AWAKENING LIFE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT DEFECTS, IF ANY, WILL BE CORRECTED.
                </p>
                <p>
                  YOU EXPRESSLY AGREE THAT YOUR USE OF AWAKENING LIFE IS AT YOUR SOLE RISK. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU 
                  FROM US SHALL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="8. Limitation of Liability" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL AWAKENING LIFE, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE 
                  FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, 
                  GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO USE, AWAKENING LIFE.
                </p>
                <p>
                  OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW IN THE APPLICABLE JURISDICTION.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="9. Indemnification" 
                icon={<ScaleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  You agree to defend, indemnify, and hold harmless Awakening Life, its officers, directors, employees, and agents, from and against any and all claims, 
                  damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees) arising from:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your use of and access to Awakening Life;</li>
                  <li>Your violation of any term of these Terms of Service;</li>
                  <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right; or</li>
                  <li>Any claim that your Content caused damage to a third party.</li>
                </ul>
                <p>
                  This defense and indemnification obligation will survive these Terms of Service and your use of Awakening Life.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="10. Governing Law" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any dispute arising from or relating to the subject matter of these Terms shall be finally settled by arbitration, using the English language, 
                  administered by the American Arbitration Association under its Commercial Arbitration Rules.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="11. Termination" 
                icon={<UserGroupIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may terminate or suspend your account and bar access to Awakening Life immediately, without prior notice or liability, under our sole discretion, 
                  for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using our services or contact us to request account deletion.
                </p>
                <p>
                  All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, 
                  ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
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
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="font-medium">
                  legal@awakeninglife.ai
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
            href="/legal/user/privacy-policy" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
} 