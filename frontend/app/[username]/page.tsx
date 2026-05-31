"use client";

import React, { useState, useEffect } from "react";
// Import all necessary beautiful, modern Lucide React icons for visual enhancements (excluding brand icons)
import { 
  Mail, 
  Globe, 
  Link as LinkIcon, 
  ExternalLink, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles 
} from "lucide-react";
import { getPublicProfileAction } from "@/app/actions/links/links";

/**
 * TYPE DEFINITIONS FOR BEGINNERS
 * 
 * In TypeScript, we declare interface blueprints to tell the editor exactly what shape
 * of data our API endpoints will return. This gives us beautiful autocomplete and prevents spelling bugs!
 */
interface ProfileData {
  username: string;
  user: {
    email: string;
    full_name: string;
    bio: string;
    avatar: string;
    email_notification: boolean;
    public_profile: boolean;
    created_at: string;
  };
  links: Array<{
    id: number;
    title: string;
    url: string;
    order: number;
    is_active: boolean;
    created_at: string;
  }>;
}

/**
 * PROP TYPES FOR NEXT.JS DYNAMIC ROUTE PAGE
 * 
 * Next.js automatically parses dynamic segments (like folder name `[username]`) 
 * and feeds them to our Page component. In modern Next.js versions (including v15 & v16), 
 * route params are delivered inside a Promise. We use React.use() or await it in server files, 
 * or unwrap it using React's dynamic API hook on the client!
 */
interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

/**
 * HELPER: DYNAMIC SOCIAL ICON MATCHING (WITHOUT DEPRECATED BRAND ICONS)
 * 
 * Since trademarked brand icons are no longer bundled directly inside lucide-react, 
 * we use pristine, high-fidelity inline SVGs for popular networks to keep the application 
 * lightweight and fully standalone. If no brand matches, we fall back to a clean Lucide icon!
 */
function getPlatformIcon(url: string, title: string) {
  const normalizedUrl = url.toLowerCase();
  const normalizedTitle = title.toLowerCase();

  // GitHub Brand SVG Path
  if (normalizedUrl.includes("github.com") || normalizedTitle.includes("github")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
      </svg>
    );
  }
  // Twitter / X Brand SVG Path
  if (normalizedUrl.includes("twitter.com") || normalizedUrl.includes("x.com") || normalizedTitle.includes("twitter") || normalizedTitle.includes("x")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  // LinkedIn Brand SVG Path
  if (normalizedUrl.includes("linkedin.com") || normalizedTitle.includes("linkedin")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
      </svg>
    );
  }
  // YouTube Brand SVG Path
  if (normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be") || normalizedTitle.includes("youtube")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
      </svg>
    );
  }
  // Instagram Brand SVG Path
  if (normalizedUrl.includes("instagram.com") || normalizedTitle.includes("instagram")) {
    return (
      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  
  // Custom fallbacks for standard platforms
  if (normalizedUrl.startsWith("mailto:") || normalizedTitle.includes("email") || normalizedTitle.includes("mail")) {
    return <Mail className="w-5 h-5" />;
  }
  if (normalizedUrl.includes("portfolio") || normalizedTitle.includes("portfolio") || normalizedTitle.includes("website") || normalizedTitle.includes("site")) {
    return <Globe className="w-5 h-5" />;
  }
  return <LinkIcon className="w-5 h-5" />;
}

export default function PublicProfilePage({ params }: PageProps) {
  // 1. React.use() unwraps our dynamic Next.js parameter Promise.
  // Next.js passes dynamic URL segments as Promises to avoid synchronous blocking!
  const { username } = React.use(params);

  // 2. State hooks to manage fetching cycle, profile data payloads, and error logs
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [is404, setIs404] = useState<boolean>(false);

  // Print parameter log to browser console to confirm route segment binding works perfectly (Task 2 Requirement)
  useEffect(() => {
    console.log(`[DYNAMIC SEGMENT LOADED] Active Username: ${username}`);
  }, [username]);

  // Dynamic Browser Tab Title Manager
  useEffect(() => {
    if (profileData?.user?.full_name) {
      document.title = `${profileData.user.full_name} (@${profileData.username}) | Pagify`;
    } else if (username) {
      document.title = `@${username} | Pagify Profile`;
    }
  }, [profileData, username]);

  // 3. Perform profile data loading on initial mount using our unauthenticated getPublicProfileAction Server Action
  useEffect(() => {
    if (!username) return;

    async function fetchPublicProfile() {
      try {
        setIsLoading(true);
        setIs404(false);

        // Fetch user records using our link actions gateway
        const res = await getPublicProfileAction(username);

        // If action responds with a 404 or fails, flag the page as missing!
        if (!res.success || res.status === 404) {
          setIs404(true);
          return;
        }

        setProfileData(res.profile as ProfileData);
      } catch (err: any) {
        console.error("Error fetching public profile details:", err);
        setIs404(true);
      } finally {
        setIsLoading(false);
      }
    }

    // Call custom inline async fetch function
    fetchPublicProfile();
  }, [username]);

  /**
   * SKELETON DISPLAY (Task 3 Requirement)
   * 
   * Pre-renders dynamic pulsing boxes that resemble the final layout.
   * This is a critical design best-practice that completely eliminates page flickering or jumping!
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950/70 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-between p-6 sm:p-8 md:p-12 font-sans transition-colors duration-300">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-10 sm:pt-16 pb-12">
          
          {/* Avatar Pulse Block */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse border-2 border-zinc-100 dark:border-zinc-900 shadow-sm" />
          
          {/* Full Name & Handle Pulses */}
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse mt-6" />
          <div className="h-4 w-28 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse mt-3" />
          
          {/* Bio text block pulses */}
          <div className="w-full max-w-sm space-y-2 mt-5">
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
            <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse mx-auto" />
          </div>

          {/* Links cards pulses */}
          <div className="mt-12 w-full space-y-4 sm:space-y-5">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="w-full h-[68px] sm:h-[76px] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Footer brand pulse */}
        <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
      </div>
    );
  }

  /**
   * FRIENDLY "PROFILE NOT FOUND" 404 DISPLAY (Task 3 Requirement)
   * 
   * Replaces the screen with a beautiful minimalist landing card informing guests
   * that the user does not exist or has set their link pages to private.
   */
  if (is404 || !profileData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-6 sm:p-8 font-sans transition-colors duration-300">
        <div /> {/* Spacer helper to push content directly to vertical center */}
        
        <div className="w-full max-w-md mx-auto text-center space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl shadow-zinc-100/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Profile Not Found
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              The profile you are trying to visit for <span className="font-semibold text-zinc-800 dark:text-zinc-200">@{username}</span> is either inactive, private, or does not exist in our database yet.
            </p>
          </div>
          
          <div className="pt-2">
            <a 
              href="/" 
              className="inline-flex items-center justify-center gap-2 h-11 px-5 w-full rounded-2xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-sm transition-all duration-200 shadow-md shadow-black/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Homepage
            </a>
          </div>
        </div>

        <footer className="text-center text-xs text-zinc-400 dark:text-zinc-650">
          &copy; {new Date().getFullYear()} Pagify. All rights reserved.
        </footer>
      </div>
    );
  }

  // Extract variables for clean rendering
  const { user, links } = profileData;
  const displayName = user.full_name || username;
  const avatarUrl = user.avatar;
  const bioText = user.bio;

  // Simple initial retrieval for missing avatars (visual enhancement)
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-6 sm:p-8 md:p-12 font-sans transition-colors duration-300">
      
      {/* MAIN CENTRAL PANEL: Highly polished responsive profile showcase */}
      <main className="w-full max-w-xl mx-auto flex flex-col items-center pt-8 sm:pt-12 pb-16">
        
        {/* AVATAR WRAPPER */}
        <div className="relative group">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${displayName}'s Profile Photo`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg border border-zinc-200 dark:border-zinc-800 group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            // Premium fallback letter-avatar block with harmonious gradient
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-lg border border-zinc-200 dark:border-zinc-800 transition-transform duration-300 group-hover:scale-102">
              {initialLetter}
            </div>
          )}
        </div>

        {/* PROFILE IDENTIFIERS */}
        <div className="mt-5 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-sans">
            {displayName}
          </h1>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            @{profileData.username}
          </div>
        </div>

        {/* BIO SUBSECTION */}
        {bioText && (
          <p className="mt-4 text-center text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-sm sm:max-w-md">
            {bioText}
          </p>
        )}

        {/* CLICKABLE LINKS LIST */}
        <div className="mt-10 w-full space-y-4 sm:space-y-5">
          {links && links.length > 0 ? (
            links.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-xl hover:shadow-zinc-100/50 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
              >
                {/* Left block containing icon + title */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Decorative platform-specific icon circle */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                    {getPlatformIcon(link.url, link.title)}
                  </div>
                  
                  {/* Link Title */}
                  <span className="font-semibold text-sm sm:text-base text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200">
                    {link.title}
                  </span>
                </div>

                {/* Right indicator arrow indicator */}
                <div className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 pr-1">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))
          ) : (
            // Visual fallback card when user hasn't toggled any active link
            <div className="text-center p-8 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm">
              This creator hasn&apos;t shared any public links yet.
            </div>
          )}
        </div>
      </main>

      {/* POLISHED BRANDING FOOTER */}
      <footer className="w-full flex justify-center py-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors shadow-xs"
        >
          <span>Powered by Pagify</span>
        </a>
      </footer>
    </div>
  );
}
