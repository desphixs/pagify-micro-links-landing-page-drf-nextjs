'use client';

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { Link2, ExternalLink, ShieldAlert, Loader2, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getLinksAction } from '@/app/actions/links/links';

// Define the shape of our Link data structure returned by the API
interface LinkData {
  id: number;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

/**
 * CREATOR DASHBOARD LINKS PAGE
 * 
 * Analogy:
 * Think of this page like a personal control deck where a musician manages their active amplifiers.
 * Each card represents a plugged-in speaker (a social link) sending their sound (traffic) to the crowd.
 * You can see at a single glance which links are connected, where they point, and which ones are actively broadcasting!
 */
export default function DashboardLinksPage() {
  // State hook to store the array of social links returned by our server action
  const [links, setLinks] = useState<LinkData[]>([]);
  
  // State hook to manage loading transitions during data fetching
  const [isLoading, setIsLoading] = useState(true);

  // Asynchronous method to handshake with our Next.js Server Action
  const fetchUserLinks = async () => {
    try {
      // 1. Dispatch our secure server action to query Django's filtered links endpoint
      const res = await getLinksAction();

      if (res.success && res.links) {
        // 2. Load the parsed links array into our state context
        setLinks(res.links as LinkData[]);
      } else {
        // 3. Trigger a visual toast notification if the API return details failed
        toast.error(res.message || "Failed to load links dashboard.");
      }
    } catch (err: any) {
      // 4. Capture any connection failures or unexpected compiler drops
      toast.error("An unexpected error occurred while loading your links.");
    }
  };

  // Mount effect running immediately when the user lands on the dashboard links tab
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Wait for server action response pipelines to finish loading
      await fetchUserLinks();
      setIsLoading(false);
    }
    loadData();
  }, []);

  // 1. Render a clean loading skeleton structure that mirrors our final list UI
  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="max-w-4xl space-y-8 animate-pulse">
          {/* Skeleton Title Section */}
          <div className="space-y-2">
            <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-4 w-96 bg-zinc-150 dark:bg-zinc-850 rounded-md" />
          </div>
          
          {/* Skeleton Cards Stack */}
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-250 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-48 bg-zinc-150 dark:bg-zinc-850 rounded" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
        
        {/* Title Heading & Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              My Social Links
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Manage the direct shortcuts and credentials displayed on your public landing profile.
            </p>
          </div>
          
          {/* Dashboard action button (minimalist style) */}
          <button 
            onClick={() => toast.info("Link creation will be enabled in Phase 2!")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>Add New Link</span>
          </button>
        </div>

        {/* Links Grid List */}
        {links.length > 0 ? (
          <div className="space-y-4">
            {links.map((link) => (
              <div 
                key={link.id} 
                className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 p-5 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Left Side: Drag/Icon Placeholder */}
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 text-zinc-400 dark:text-zinc-505 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/80 transition-colors">
                    <Link2 size={18} />
                  </div>
                  
                  {/* Link Text Context */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                        {link.title}
                      </h3>
                      {!link.is_active && (
                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Hidden
                        </span>
                      )}
                    </div>
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 hover:underline truncate"
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Right Side: Active toggle or badge display */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                    Order {link.order}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state view styled in clean modern aesthetics */
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/5 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-800">
              <Link2 size={24} />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white">
                No Links Found
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                You haven't registered any social links yet! Click the button above to add your first portfolio shortcut.
              </p>
            </div>
            
            <button 
              onClick={() => toast.info("Link creation will be enabled in Phase 2!")}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-zinc-900 dark:text-white cursor-pointer transition-colors"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>Create First Link</span>
            </button>
          </div>
        )}

      </div>
    </DashboardWrapper>
  );
}
