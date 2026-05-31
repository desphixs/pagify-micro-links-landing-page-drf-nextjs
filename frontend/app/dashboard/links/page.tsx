'use client';

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { Link2, ExternalLink, Plus, Sparkles, X, Trash2, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { getLinksAction, deleteLinkAction } from '@/app/actions/links/links';
import CreateLinkForm from '@/components/dashboard/CreateLinkForm';
import EditLinkForm from '@/components/dashboard/EditLinkForm';

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
 * We have upgraded the deck to allow modular, hot-swappable tuning plug-ins (EditLinkForm) to edit speaker settings inline.
 */
export default function DashboardLinksPage() {
  // State hook to store the array of social links returned by our server action
  const [links, setLinks] = useState<LinkData[]>([]);
  
  // State hook to manage loading transitions during data fetching
  const [isLoading, setIsLoading] = useState(true);

  // Controls showing or hiding our modular creation form component
  const [showForm, setShowForm] = useState(false);

  // Tracks which link ID is actively undergoing backend deletion (to show spinning trash cans!)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Tracks which link ID is actively being edited inline (null means no link is being edited)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Asynchronous method to handshake with our Next.js Server Action to list links
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

  // Sets the active editing ID to reveal the modular inline edit form
  const handleEditStart = (linkId: number) => {
    setEditingId(linkId);
  };

  // Clears the active editing ID to collapse the edit form
  const handleEditCancel = () => {
    setEditingId(null);
  };

  // Deletion handler to submit data securely using our Server Action
  const handleDeleteLinkSubmit = async (linkId: number) => {
    // Prevent double clicking or parallel deletes
    if (deletingId !== null) return;
    
    // Set active loader on the chosen card
    setDeletingId(linkId);

    try {
      // 1. Dispatch our secure Server Action to query Django's delete view
      const res = await deleteLinkAction(linkId);

      if (res.success) {
        // 2. Remove the deleted link item from the React state list instantly!
        setLinks((prev) => prev.filter((l) => l.id !== linkId));
        // 3. Trigger a visual success toast alert
        toast.success("Link deleted successfully.");
      } else {
        // 4. Trigger error notification
        toast.error(res.message || "Failed to delete link.");
      }
    } catch (err: any) {
      // 5. Catch network exceptions
      toast.error("An unexpected network error occurred while deleting.");
    } finally {
      // 6. Reset deleting state loader
      setDeletingId(null);
    }
  };

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
                    <div className="h-4 w-32 bg-zinc-250 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-zinc-150 dark:bg-zinc-850 rounded animate-pulse" />
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
          
          {/* Toggle form button styled inside premium design guidelines */}
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all shrink-0 animate-in fade-in"
          >
            {showForm ? (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add New Link</span>
              </>
            )}
          </button>
        </div>

        {/* --- MODULAR LINK CREATION FORM --- */}
        {showForm && (
          <CreateLinkForm 
            onSuccess={(newLink) => {
              // Append the newly created link directly to our state list so it displays instantly!
              setLinks((prev) => [...prev, newLink]);
              // Close the form panel
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Links Grid List */}
        {links.length > 0 ? (
          <div className="space-y-4">
            {links.map((link) => (
              editingId === link.id ? (
                /* --- MODULAR INLINE EDIT FORM COMPONENT --- */
                <EditLinkForm
                  key={link.id}
                  link={link}
                  onSuccess={(updatedLink) => {
                    // Update the item in the local list array state instantly!
                    setLinks((prev) =>
                      prev.map((l) => (l.id === link.id ? updatedLink : l))
                    );
                    // Collapse the editing form mode
                    handleEditCancel();
                  }}
                  onCancel={handleEditCancel}
                />
              ) : (
                /* --- DEFAULT SOCIAL CARD RENDERING --- */
                <div 
                  key={link.id} 
                  className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/20 p-5 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Left Side: Drag/Icon Placeholder */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/80 transition-colors">
                      <Link2 size={18} />
                    </div>
                    
                    {/* Link Text Context */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                          {link.title}
                        </h3>
                        {!link.is_active && (
                          <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Hidden
                          </span>
                        )}
                      </div>
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 hover:underline truncate"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Right Side: Order parameter, Edit Button, and Delete Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 px-2 py-1 rounded-lg">
                      Order {link.order}
                    </span>

                    {/* Inline Edit Button Trigger */}
                    <button
                      onClick={() => handleEditStart(link.id)}
                      disabled={deletingId !== null || editingId !== null}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer disabled:opacity-50"
                      title="Edit Link"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteLinkSubmit(link.id)}
                      disabled={deletingId !== null || editingId !== null}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all cursor-pointer disabled:opacity-50"
                      title="Delete Link"
                    >
                      {deletingId === link.id ? (
                        <Loader2 size={16} className="animate-spin text-red-600 dark:text-red-400" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          /* Empty state view styled in clean modern aesthetics */
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-900/5 p-12 text-center max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-800">
              <Link2 size={24} />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-zinc-950 dark:text-white">
                No Links Found
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                You haven't registered any social links yet! Open the creation panel to register your first shortcut.
              </p>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-zinc-900 dark:text-white cursor-pointer transition-colors"
            >
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              <span>Create First Link</span>
            </button>
          </div>
        )}

      </div>
    </DashboardWrapper>
  );
}
