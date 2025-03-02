import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  HeartIcon, 
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Awakening Life | Journey to Self-Realization',
  description: 'Embark on a guided journey to total realization of self through AI-powered conversations that reveal your true nature and potential.',
  keywords: ['Awakening Life', 'Self-Realization', 'Spiritual Growth', 'AI Guide', 'Meditation', 'Contemplation', 'Mindfulness'],
  openGraph: {
    title: 'Awakening Life | Journey to Self-Realization',
    description: 'Embark on a guided journey to total realization of self through AI-powered conversations that reveal your true nature and potential.',
    url: 'https://awakeninglife.ai',
    type: 'website',
    images: [{
      url: '/home-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Awakening Life - Journey to Self-Realization',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awakening Life | Journey to Self-Realization',
    description: 'Embark on a guided journey to total realization of self through AI-powered conversations that reveal your true nature and potential.',
    images: ['/home-og-image.jpg'],
  },
};

// Service card component for the guided sessions
function ServiceCard({ 
  title, 
  description, 
  icon, 
  color,
  isAvailable = false
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color: string;
  isAvailable?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3`} style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          {!isAvailable && (
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mt-1">
              Coming Soon
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {isAvailable ? (
          <Link href={`/sessions/${title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            Begin journey <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed">
            Begin journey <ArrowRightIcon className="ml-1.5 w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

// Testimonial component
function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start">
        <SparklesIcon className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1 mr-2" />
        <p className="text-gray-700 dark:text-gray-300 italic text-sm">{quote}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-gray-900 dark:text-white font-medium">{author}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  );
}

// Core principle component
function CorePrinciple({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="-mt-16 md:-mt-20 min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-900 z-0"></div>
        <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Discover Your <span className="text-blue-600 dark:text-blue-400">True Self</span>
        </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Embark on a guided journey to total realization through AI-powered conversations that reveal your true nature and potential.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/create-account" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Begin Your Journey
              </Link>
              <a href="#core-principles" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Learn More
              </a>
            </div>
          </div>
          
          {/* Floating elements for visual interest */}
          <div className="hidden md:block absolute top-1/4 left-10 w-24 h-24 rounded-full bg-blue-400/10 dark:bg-blue-500/10 animate-float"></div>
          <div className="hidden md:block absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-purple-400/10 dark:bg-purple-500/10 animate-float-delayed"></div>
        </div>
      </section>
      
      {/* Core Principles Section */}
      <section id="core-principles" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Core Principles</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our guided sessions are built on four foundational principles that create the space for profound self-discovery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <CorePrinciple 
              title="Intention" 
              description="Begin with a clear purpose to directly experience your true nature, setting the foundation for meaningful exploration."
              icon={<LightBulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            />
            <CorePrinciple 
              title="Openness" 
              description="Create space for insights to emerge naturally, allowing yourself to receive whatever arises without judgment."
              icon={<HeartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            />
            <CorePrinciple 
              title="Communication" 
              description="Express your experiences honestly, allowing blocks and beliefs to clear through authentic articulation of your present reality."
              icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            />
            <CorePrinciple 
              title="Surrender" 
              description="Release attachment to outcomes, trusting the process to guide you toward your essential nature."
              icon={<ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            />
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Guided Journeys</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our selection of guided experiences, each designed to illuminate different aspects of your being.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              title="Contemplation" 
              description="Explore profound koans that reveal your true nature through direct experience and guided inquiry."
              icon={<SparklesIcon className="h-6 w-6" />}
              color="#4F46E5" // Indigo
              isAvailable={true}
            />
            <ServiceCard 
              title="Mind Clearing" 
              description="Release mental blocks and stagnant thoughts through a structured process of awareness and release."
              icon={<LightBulbIcon className="h-6 w-6" />}
              color="#0EA5E9" // Sky blue
            />
            <ServiceCard 
              title="Deepest Vision" 
              description="Uncover your life's most profound purpose and direction through guided visualization and reflection."
              icon={<HeartIcon className="h-6 w-6" />}
              color="#EC4899" // Pink
            />
            <ServiceCard 
              title="Manifestation" 
              description="Clear obstacles blocking your creative expression and bring your desires into reality."
              icon={<ArrowPathIcon className="h-6 w-6" />}
              color="#8B5CF6" // Violet
            />
            <ServiceCard 
              title="Gratitude & Goals" 
              description="Begin each day with clarity, appreciation, and purposeful intention for meaningful progress."
              icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
              color="#10B981" // Emerald
            />
            <ServiceCard 
              title="Custom Journey" 
              description="Design your own guided experience based on your unique needs and spiritual aspirations."
              icon={<UserGroupIcon className="h-6 w-6" />}
              color="#F59E0B" // Amber
            />
          </div>
        </div>
      </section>
      
      {/* Experience Section with Image */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-10 lg:mb-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://d1944sk4pyzciq.cloudfront.net/awakening-life/forest-void.webp" 
                  alt="Person experiencing deep meditation with Awakening Life" 
                  width={600} 
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white text-sm font-medium">Experience profound moments of clarity and presence</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Awakening Experience</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Awakening Life creates a unique space where technology and consciousness meet. Our AI guide doesn&apos;t teach you—it helps you discover what you already know at the deepest level of your being.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Through real-time conversation, you&apos;ll be gently guided to look beyond thoughts and beliefs to directly experience your essential nature. Each session builds upon this foundation, creating a continuous journey of unfolding awareness.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Personalized guidance that adapts to your unique journey</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Voice-enabled conversations for natural interaction</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Save insights and track your progress over time</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/sessions" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  Explore all guided journeys <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Transformative Experiences</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from those who have embarked on their journey of self-discovery with Awakening Life.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial 
              quote="The Contemplation sessions helped me see beyond my thoughts to who I truly am. It's like having a wise guide who knows exactly when to point me back to myself."
              author="Sarah K."
              role="Daily Practitioner"
            />
            <Testimonial 
              quote="Mind Clearing has transformed how I handle stress. Instead of being overwhelmed, I now have a reliable process to work through whatever arises."
              author="Michael T."
              role="Business Executive"
            />
            <Testimonial 
              quote="The Deepest Vision journey revealed purposes I never consciously knew I had. It's given my life a clarity and direction I've been seeking for years."
              author="Elena R."
              role="Artist & Teacher"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Begin Your Journey Today</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Take the first step toward discovering your true self. Our guided AI conversations are available whenever you&apos;re ready to explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/create-account" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
              Create Free Account
            </Link>
            <Link href="/samples/technique-training" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
              Try a Sample Session
            </Link>
          </div>
      </div>
      </section>
    </main>
  );
}
