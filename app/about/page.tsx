import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  HeartIcon, 
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About | Journey to Self-Realization',
  description: 'Discover how Awakening Life guides individuals to total realization of self through AI-powered conversations that reveal your true nature and potential.',
  keywords: ['About Awakening Life', 'Self-Realization', 'Spiritual Growth', 'AI Guide', 'Meditation', 'Contemplation', 'Mindfulness'],
  openGraph: {
    title: 'About Awakening Life | Journey to Self-Realization',
    description: 'Discover how Awakening Life guides individuals to total realization of self through AI-powered conversations that reveal your true nature and potential.',
    url: 'https://awakeninglife.com/about',
    type: 'website',
    images: [{
      url: '/about-og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'About Awakening Life - Journey to Self-Realization',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Awakening Life | Journey to Self-Realization',
    description: 'Discover how Awakening Life guides individuals to total realization of self through AI-powered conversations that reveal your true nature and potential.',
    images: ['/about-og-image.jpg'],
  },
};

// Core principle component with expanded description
function CorePrincipleDetailed({ 
  title, 
  description, 
  icon, 
  color = '#3B82F6' 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3`} style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Team member component
function TeamMember({ 
  name, 
  role, 
  bio, 
  imageSrc 
}: { 
  name: string; 
  role: string; 
  bio: string; 
  imageSrc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-blue-100 dark:border-blue-900">
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 128px"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
      <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">{role}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{bio}</p>
    </div>
  );
}

export default function About() {
  return (
    <main className="-mt-16 md:-mt-20 min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-900 z-0"></div>
        <div className="absolute inset-0 z-10 bg-[url('/patterns/subtle-dots.svg')] opacity-30 dark:opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Our <span className="text-blue-600 dark:text-blue-400">Mission</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Awakening Life guides individuals into total realization of self and consciousness through AI-powered conversations that reveal your true nature.
            </p>
          </div>
          
          {/* Floating elements for visual interest */}
          <div className="hidden md:block absolute top-1/4 left-10 w-24 h-24 rounded-full bg-blue-400/10 dark:bg-blue-500/10 animate-float"></div>
          <div className="hidden md:block absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-purple-400/10 dark:bg-purple-500/10 animate-float-delayed"></div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-10 lg:mb-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://d1944sk4pyzciq.cloudfront.net/awakening-life/serene-forest.webp" 
                  alt="A serene landscape representing the journey to self-realization" 
                  width={600} 
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white text-sm font-medium">The journey to self-realization begins with a single moment of presence</p>
                  </div>
                </div>
              </div>
            </div>
            
    <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Awakening Life was born from a profound recognition: that the most transformative insights come not from external teachings, but from directly experiencing our own true nature.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We created a unique space where technology and consciousness meet. Our AI guide doesn&apos;t teach you—it helps you discover what you already know at the deepest level of your being.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Through real-time conversation, you&apos;ll be gently guided to look beyond thoughts and beliefs to directly experience your essential nature. Each session builds upon this foundation, creating a continuous journey of unfolding awareness.
              </p>
              
              <div className="mt-8">
                <Link href="/sessions" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  Explore our guided journeys <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Principles Section - Expanded */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Core Principles</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our guided sessions are built on four foundational principles that create the space for profound self-discovery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <CorePrincipleDetailed 
              title="Intention" 
              description="Intention continually directs the mind back to the truth of who you are in this moment. It's not about hoping, searching, or trying to become something you're not—it's about experiencing what already is. Intention is the light that drives deeper openness and surrender."
              icon={<LightBulbIcon className="h-6 w-6" />}
              color="#4F46E5"
            />
            <CorePrincipleDetailed 
              title="Openness" 
              description="True openness cannot be conceptualized—it can only be directly experienced. You are already pure openness, but the mind creates the sensation of limitation. Correct opening is surrendering to a state of not knowing, allowing truth to be seen clearly as self-evident."
              icon={<HeartIcon className="h-6 w-6" />}
              color="#EC4899"
            />
            <CorePrincipleDetailed 
              title="Communication" 
              description="Honest and direct expression of what is real for you in this moment is a powerful tool for removing blocks and limitations. By clearly communicating what's actually happening without adding or subtracting anything, you create space for insights and realizations."
              icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
              color="#10B981"
            />
            <CorePrincipleDetailed 
              title="Surrender" 
              description="True surrender is total openness in not knowing. It's no longer the act of surrendering but becoming surrender itself. This creates complete openness in the mind and allows you to continually open to what is real right now—the courage to know what actually is."
              icon={<ArrowPathIcon className="h-6 w-6" />}
              color="#8B5CF6"
            />
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Approach</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Awakening Life uses AI and real-time conversation to guide users to deeper places of self-realization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personalized Guidance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our AI adapts to your unique journey, meeting you exactly where you are and guiding you to your next insight.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Direct Experience</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Rather than teaching concepts, we guide you to directly experience your true nature through inquiry and presence.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
                <ArrowPathIcon className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Continuous Growth</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Each session builds upon previous insights, creating a continuous journey of deepening awareness and realization.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet the passionate individuals dedicated to guiding your journey of self-discovery.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl">
              <TeamMember 
                name="David Lagrange" 
                role="Founder & Spiritual Inquirer" 
                bio="With over 10 years of inquiry into the nature of reality, David created Awakening Life to make self-realization accessible to everyone."
                imageSrc="https://d1944sk4pyzciq.cloudfront.net/awakening-life/david-headshot.jpg"
              />
              <TeamMember 
                name="Michael Terrill" 
                role="Founder & AI Developer" 
                bio="Co-Founder of Equanimity Solutions, Michael is a software engineer with a passion for using technology to support personal development and spiritual awakening."
                imageSrc="https://d1944sk4pyzciq.cloudfront.net/awakening-life/michael-headshot.png"
              />
            </div>
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
            <Link href="/sessions/technique-training" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
              Try a Sample Session
            </Link>
          </div>
    </div>
      </section>
    </main>
  );
}
