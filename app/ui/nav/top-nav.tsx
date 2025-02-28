'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from '@/app/lib/theme/theme-toggle';
import { useSession } from 'next-auth/react';
import { signOutAction } from '@/app/lib/actions/auth/login-actions';
import { useRouter } from 'next/navigation';

type Link = {
    href?: string;
    label: string;
    dropdownLinks?: { href: string; label: string; dot?: string; }[];
    authRequired?: boolean;
    dot?: string;
};

const links: Link[] = [
  {
    label: "Life Purpose",
    href: "/life-purpose",
    authRequired: true,
    dot: "#3B82F6", // Blue color from life-purpose page
  },
  {
    label: "Gratitude",
    href: "/gratitude",
    authRequired: true,
    dot: "#10B981", // Emerald color from gratitude page
  },
  {
    label: "Openness",
    href: "/openness",
    authRequired: true,
    dot: "#F59E0B", // Yellow color from openness page
  },
    {
        label: "Account",
        authRequired: true,
        dropdownLinks: [
            { href: "/account/profile?tab=profile", label: "Profile" },
            { href: "/account/profile?tab=subscription", label: "Subscription" },
            { href: "/account/billing", label: "Billing & Payments" },
            { href: "/account/profile?tab=security", label: "Security" },
        ],
    },

];

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdownIndex, setOpenMobileDropdownIndex] = useState<number | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRefs.current.every(ref => ref && !ref.contains(event.target as Node))) {
        setOpenDropdownIndex(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // console.log('Navigation Session Proof')
  // console.log('Navigation: Session status:', status);
  // console.log('Navigation: User:', session?.user);

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/redirects/logout');
  };

  function DesktopNavLinks() {
    return (
      <div className="flex items-center space-x-6">
        {links.map((link, index) => {
          if (link.dropdownLinks) {
            return (
              (!link.authRequired || (link.authRequired && session)) && (
                <div 
                  key={index} 
                  className="relative" 
                  ref={el => {
                    dropdownRefs.current[index] = el;
                  }}
                >
                  <button
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                  >
                    {link.label}
                  </button>
                  {openDropdownIndex === index && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      {link.dropdownLinks.map((dropdownLink, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownLink.href}
                          className="block px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors flex items-center group"
                          onClick={() => setOpenDropdownIndex(null)}
                        >
                          {dropdownLink.dot && (
                            <span 
                              className="w-2 h-2 rounded-full mr-2 transition-transform group-hover:scale-150"
                              style={{ backgroundColor: dropdownLink.dot }}
                            />
                          )}
                          {dropdownLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            );
          } else if (!link.authRequired || (link.authRequired && session)) {
            return (
              <Link
                key={index}
                href={link.href!}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors flex items-center group"
              >
                {link.dot && (
                  <span 
                    className="w-2 h-2 rounded-full mr-2 transition-transform group-hover:scale-150"
                    style={{ backgroundColor: link.dot }}
                  />
                )}
                {link.label}
              </Link>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <nav className="relative w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-20">
      <div className="w-full px-4 md:px-20">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-gray-800 dark:text-gray-50 font-semibold text-lg">
              Awakening Life
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <DesktopNavLinks />
            <div className="hidden md:flex items-center space-x-4">
              {status === 'loading' ? (
                <div>Loading...</div>
              ) : session ? (
                <>
                  <span className="text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  Sign in
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link, index) => {
                if (link.dropdownLinks) {
                  return (
                    (!link.authRequired || (link.authRequired && session)) && (
                      <div key={index}>
                        <button
                          onClick={() => setOpenMobileDropdownIndex(openMobileDropdownIndex === index ? null : index)}
                          className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          {link.label}
                        </button>
                        {openMobileDropdownIndex === index && (
                          <div className="pl-6">
                            {link.dropdownLinks.map((dropdownLink, dropdownIndex) => (
                              <Link
                                key={dropdownIndex}
                                href={dropdownLink.href}
                                className="block px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center group"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dropdownLink.dot && (
                                  <span 
                                    className="w-2 h-2 rounded-full mr-2 transition-transform group-hover:scale-150"
                                    style={{ backgroundColor: dropdownLink.dot }}
                                  />
                                )}
                                {dropdownLink.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  );
                } else if (!link.authRequired || (link.authRequired && session)) {
                  return (
                    <Link
                      key={index}
                      href={link.href!}
                      className="block px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.dot && (
                        <span 
                          className="w-2 h-2 rounded-full mr-2 transition-transform group-hover:scale-150"
                          style={{ backgroundColor: link.dot }}
                        />
                      )}
                      {link.label}
                    </Link>
                  );
                }
                return null;
              })}
              <div className="mx-4 my-2 border-t border-gray-200 dark:border-gray-700"></div>
              {/* Add authentication controls */}
              {status === 'loading' ? (
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">Loading...</div>
              ) : session ? (
                <>
                  <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
              <div className="px-3 py-2 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
