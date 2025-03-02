import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CodeBracketIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'API Terms of Service | Awakening Life',
  description: 'Terms and conditions for developers using the Awakening Life API for integration with self-realization services.',
  keywords: ['API Terms', 'Developer Terms', 'Awakening Life API', 'Integration Terms', 'API Usage'],
  openGraph: {
    title: 'API Terms of Service | Awakening Life',
    description: 'Terms and conditions for developers using the Awakening Life API for integration with self-realization services.',
    url: 'https://awakeninglife.ai/legal/api/terms-of-service',
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

export default function APITermsOfService() {
  return (
    <main className="min-h-screen pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 z-0 h-1/3"></div>
      <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10 h-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            API Terms of <span className="text-blue-600 dark:text-blue-400">Service</span>
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
                  The Awakening Life API is currently not available for public use. These terms will apply when API access becomes available.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            These API Terms of Service (&quot;API Terms&quot;) govern your access to and use of the Awakening Life application programming interface 
            and related documentation (collectively, the &quot;API&quot;). By accessing or using the API, you agree to be bound by these API Terms.
          </p>
          
          <div className="space-y-8">
            <section>
              <SectionHeader 
                title="1. API License and Access" 
                icon={<CodeBracketIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Subject to your compliance with these API Terms, Awakening Life grants you a limited, non-exclusive, non-transferable, 
                  non-sublicensable, revocable license to access and use the API solely for the purpose of developing, testing, and supporting 
                  your integration with Awakening Life services.
                </p>
                <p>
                  To access the API, you must obtain API credentials (such as API keys or tokens) from Awakening Life. You are responsible for 
                  maintaining the security of your API credentials and for all activities that occur using your credentials.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue the API or any portion thereof at any time, with or without notice. 
                  We will make reasonable efforts to notify you of significant changes to the API.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="2. API Usage and Restrictions" 
                icon={<ServerIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  When using the API, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Comply with all applicable laws, regulations, and third-party rights</li>
                  <li>Comply with any rate limits and other usage restrictions documented in our API documentation</li>
                  <li>Implement reasonable security measures to protect user data</li>
                  <li>Respect user privacy and obtain all necessary consents for the collection and use of user data</li>
                </ul>
                
                <p className="mt-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use the API for any illegal, harmful, or offensive purpose</li>
                  <li>Interfere with or disrupt the integrity or performance of the API or the data contained therein</li>
                  <li>Attempt to gain unauthorized access to the API or related systems</li>
                  <li>Use the API to create a product or service that is substantially similar to or competes with Awakening Life</li>
                  <li>Remove, obscure, or alter any proprietary notices or labels on the API or its documentation</li>
                  <li>Sell, lease, share, transfer, or sublicense the API or access to it</li>
                </ul>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="3. Self-Realization Content Guidelines" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  When using the API to access or process self-realization content, you must:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Respect the sensitive and personal nature of self-realization journeys</li>
                  <li>Clearly communicate to users how their data will be used and shared</li>
                  <li>Implement appropriate security measures to protect user content</li>
                  <li>Not use self-realization content for advertising or marketing purposes without explicit consent</li>
                  <li>Not modify or misrepresent the guidance provided through the Awakening Life API</li>
                </ul>
                
                <p className="mt-4">
                  Any integration that accesses or processes user content must adhere to these guidelines and must be reviewed and approved 
                  by Awakening Life before being made available to users.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="4. Data Privacy and Security" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  When handling user data obtained through the API, you must:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Comply with all applicable data protection and privacy laws</li>
                  <li>Implement and maintain appropriate technical and organizational measures to protect user data</li>
                  <li>Only collect, use, and share user data in accordance with your privacy policy and user consent</li>
                  <li>Promptly notify Awakening Life of any unauthorized access to or disclosure of user data</li>
                </ul>
                
                <p className="mt-4">
                  Your privacy policy must clearly disclose how you collect, use, store, and share user data obtained through the API. 
                  You must obtain explicit consent from users before accessing their Awakening Life data.
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
                  The API, including its structure, organization, source code, documentation, and content, is protected by copyright, 
                  trademark, and other intellectual property laws. Except for the limited license granted in these API Terms, Awakening Life 
                  and its licensors retain all right, title, and interest in and to the API.
                </p>
                <p>
                  You may not use Awakening Life&apos;s trademarks, logos, or service marks without our prior written consent. Any use of 
                  Awakening Life&apos;s brand assets must comply with our Brand Guidelines.
                </p>
                <p>
                  If you provide feedback or suggestions regarding the API, you grant Awakening Life a perpetual, irrevocable, worldwide, 
                  royalty-free license to use, modify, and distribute such feedback without restriction.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="6. API Changes and Versioning" 
                icon={<ClockIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may modify the API from time to time, including by adding, removing, or changing features. We will use reasonable efforts 
                  to provide notice of material changes through our developer documentation or communication channels.
                </p>
                <p>
                  We may maintain multiple versions of the API simultaneously. Each version will be supported for a specified period as 
                  documented in our API versioning policy. You are responsible for updating your integration to use supported versions of the API.
                </p>
                <p>
                  Deprecated features or versions will be identified in our documentation with a timeline for removal. You should migrate away 
                  from deprecated features or versions within the specified timeline.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="7. Monitoring and Enforcement" 
                icon={<ServerIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We monitor use of the API for compliance with these API Terms and to maintain the security and integrity of our systems. 
                  You agree that we may collect and use technical information about your usage of the API to improve our services.
                </p>
                <p>
                  If we believe that you have violated these API Terms, we may:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Issue a warning</li>
                  <li>Temporarily or permanently revoke your API access</li>
                  <li>Terminate your Awakening Life account</li>
                  <li>Pursue legal remedies</li>
                </ul>
                
                <p className="mt-4">
                  We reserve the right to enforce these API Terms at our discretion. Failure to enforce any provision does not constitute a waiver 
                  of that provision or any other provision.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="8. Disclaimer of Warranties" 
                icon={<ExclamationTriangleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  THE API IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT 
                  LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  WE DO NOT WARRANT THAT THE API WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED. 
                  WE DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OF THE API IN TERMS OF ACCURACY, RELIABILITY, OR OTHERWISE.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="9. Limitation of Liability" 
                icon={<ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL AWAKENING LIFE BE LIABLE FOR ANY INDIRECT, PUNITIVE, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, 
                  USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE API.
                </p>
                <p>
                  OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE API TERMS OR YOUR USE OF THE API SHALL NOT EXCEED THE 
                  AMOUNT PAID BY YOU TO AWAKENING LIFE FOR USE OF THE API DURING THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="10. Indemnification" 
                icon={<ScaleIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  You agree to defend, indemnify, and hold harmless Awakening Life, its officers, directors, employees, and agents from and against 
                  any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees) 
                  arising from:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your use of the API</li>
                  <li>Your violation of these API Terms</li>
                  <li>Your violation of any third-party rights, including without limitation any privacy or intellectual property rights</li>
                  <li>Any content or applications you develop using the API</li>
                </ul>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="11. Term and Termination" 
                icon={<ClockIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  These API Terms will remain in effect until terminated by you or Awakening Life.
                </p>
                <p>
                  You may terminate these API Terms at any time by ceasing all use of the API and deleting all API credentials.
                </p>
                <p>
                  We may terminate these API Terms or suspend your access to the API at any time for any reason without notice. Upon termination, 
                  you must cease all use of the API and delete all API credentials.
                </p>
                <p>
                  Sections 5 (Intellectual Property), 8 (Disclaimer of Warranties), 9 (Limitation of Liability), 10 (Indemnification), and 12 (General Legal Terms) 
                  will survive any termination of these API Terms.
                </p>
              </div>
            </section>
            
            <section>
              <SectionHeader 
                title="12. General Legal Terms" 
                icon={<DocumentTextIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />} 
              />
              <div className="pl-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  These API Terms constitute the entire agreement between you and Awakening Life regarding the API and supersede all prior agreements 
                  and understandings.
                </p>
                <p>
                  If any provision of these API Terms is found to be unenforceable, that provision will be limited or eliminated to the minimum extent 
                  necessary, and the remaining provisions will remain in full force and effect.
                </p>
                <p>
                  These API Terms are governed by the laws of the United States without regard to conflict of law principles. Any disputes arising from 
                  these API Terms shall be resolved exclusively in the courts located in the United States.
                </p>
                <p>
                  You may not assign or transfer these API Terms or any rights or obligations hereunder without our prior written consent. We may assign 
                  these API Terms without restriction.
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
                  If you have any questions about these API Terms, please contact us at:
                </p>
                <p className="font-medium">
                  api-support@awakeninglife.ai
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
            href="/legal/api/privacy-policy" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            API Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
} 