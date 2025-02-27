export function SubscriptionSelectorSkeleton() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Choose Your Plan</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative p-6 rounded-lg border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-800 shadow-sm min-h-[500px] flex flex-col"
            >
              <div className="absolute top-4 right-4">
                <div className="relative w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
  
              <div className="flex-grow">
                <div className="relative h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
                <div className="relative h-20 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
                
                <div className="mb-6">
                  <div className="relative h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
  
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-200 dark:bg-green-900/30 animate-pulse" />
                      <div className="ml-2.5 h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="mt-6">
                <div className="relative h-10 w-full bg-blue-100 dark:bg-blue-900/20 rounded-md animate-pulse border border-blue-300 dark:border-blue-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }