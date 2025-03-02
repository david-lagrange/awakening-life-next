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
    href: "/sessions/life-purpose",
    authRequired: true,
    dot: "#3B82F6", // Blue color from life-purpose page
  },
  {
    label: "Gratitude",
    href: "/sessions/gratitude",
    authRequired: true,
    dot: "#10B981", // Emerald color from gratitude page
  },
  {
    label: "Openness",
    href: "/sessions/openness",
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
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                  {openDropdownIndex === index && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg py-1 z-50 border border-gray-200/50 dark:border-gray-700/50">
                      {link.dropdownLinks.map((dropdownLink, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownLink.href}
                          className="block px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors flex items-center group"
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
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center group"
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

  // Use the new transparent design for all pages
  return (
    <nav className="w-full z-20 pt-4 absolute">
      <div className="w-full px-4 md:px-20">
        <div className="flex justify-between items-center py-2">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-gray-800 dark:text-gray-50 font-semibold text-lg">
              Awakening Life
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <DesktopNavLinks />
            
            {/* Auth and Theme Toggle */}
            <div className="flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-md bg-white/10 backdrop-blur-sm border border-gray-200/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-md bg-white/10 backdrop-blur-sm border border-gray-200/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 transition-colors"
                >
                  Sign in
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
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
          <div className="md:hidden mt-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link, index) => {
                if (link.dropdownLinks) {
                  return (
                    (!link.authRequired || (link.authRequired && session)) && (
                      <div key={index}>
                        <button
                          onClick={() => setOpenMobileDropdownIndex(openMobileDropdownIndex === index ? null : index)}
                          className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                        >
                          {link.label}
                        </button>
                        {openMobileDropdownIndex === index && (
                          <div className="pl-6">
                            {link.dropdownLinks.map((dropdownLink, dropdownIndex) => (
                              <Link
                                key={dropdownIndex}
                                href={dropdownLink.href}
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-md transition-colors flex items-center group"
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
                      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-md transition-colors flex items-center group"
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
              <div className="mx-4 my-2 border-t border-gray-200/50 dark:border-gray-700/50"></div>
              {/* Add authentication controls */}
              {status === 'loading' ? (
                <div className="px-3 py-2 text-gray-700 dark:text-gray-300">Loading...</div>
              ) : session ? (
                <>
                  <div className="px-3 py-2 text-gray-700 dark:text-gray-300">
                    {session.user?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
