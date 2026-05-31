'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { createLinkAction } from '@/app/actions/links/links';

// Define the shape of our Link data structure returned by the API
interface LinkData {
  id: number;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

// Define the properties (Props) that the parent component must pass to this form
interface CreateLinkFormProps {
  onSuccess: (newLink: LinkData) => void; // Callback to append the new link to the parent's state
  onCancel: () => void;                   // Callback to hide the form when the user clicks Cancel or X
}

/**
 * CREATE LINK FORM COMPONENT
 * 
 * Analogy:
 * Think of this component like a detachable console controller plug.
 * Instead of soldering the controller directly into the motherboard (the main list page),
 * we build it as a separate plug-in accessory. It handles its own buttons and inputs (local states like title & url),
 * and when the user presses 'Submit', it sends the signal (the successfully saved LinkData) back to the main console
 * through a wire (the onSuccess callback) so the dashboard can display it!
 */
export default function CreateLinkForm({ onSuccess, onCancel }: CreateLinkFormProps) {
  // Local state hooks to track what the user types into each input field
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState('0');
  
  // Local state hook to track if the network request is currently loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state hook to capture and show backend validation error alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form submission handler
  const handleCreateLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // Front-end check: Verify fields are filled and not just full of spaces
    if (!title.trim() || !url.trim()) {
      setErrorMsg("Both Link Title and URL destination are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Trigger our secure Server Action to make a POST request to our Django /api/links/ view
      const res = await createLinkAction(
        title.trim(),
        url.trim(),
        parseInt(order) || 0
      );

      if (res.success && res.link) {
        // 2. Clear input fields so the form is clean for the next usage
        setTitle('');
        setUrl('');
        setOrder('0');
        
        // 3. Trigger success toast notification
        toast.success("New shortcut link added successfully!");
        
        // 4. Pass the newly created database object to the parent component's state handler
        onSuccess(res.link as LinkData);
      } else {
        // 5. If the backend manually validates and flags an issue, display it
        setErrorMsg(res.message || "Failed to add new link.");
        toast.error(res.message || "Failed to add new link.");
      }
    } catch (err: any) {
      // 6. Handle unexpected connection drops
      setErrorMsg("Failed to connect to backend server. Check your network connection.");
      toast.error("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-250 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/10 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-inner">
      
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
          <span>New Link Entry</span>
        </h2>
        <button 
          onClick={onCancel}
          type="button"
          className="text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Dynamic Error Message Banner */}
      {errorMsg && (
        <div className="rounded-xl border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 p-4 flex gap-2.5 items-start">
          <AlertCircle className="text-red-550 dark:text-red-400 shrink-0 mt-0.5" size={14} />
          <p className="text-xs text-red-650 dark:text-red-400 leading-relaxed font-semibold">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Inline Form Structure */}
      <form onSubmit={handleCreateLinkSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Title Input Column */}
        <div className="md:col-span-4 space-y-1.5">
          <label htmlFor="inline-title" className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Title
          </label>
          <input 
            id="inline-title"
            type="text"
            placeholder="e.g. My Twitter Profile"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all disabled:opacity-60"
            required
          />
        </div>

        {/* URL Input Column */}
        <div className="md:col-span-5 space-y-1.5">
          <label htmlFor="inline-url" className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Destination URL
          </label>
          <input 
            id="inline-url"
            type="url"
            placeholder="https://twitter.com/myusername"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all disabled:opacity-60"
            required
          />
        </div>

        {/* Order Input Column */}
        <div className="md:col-span-1.5 space-y-1.5">
          <label htmlFor="inline-order" className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Order
          </label>
          <input 
            id="inline-order"
            type="number"
            min="0"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-zinc-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white transition-all disabled:opacity-60"
          />
        </div>

        {/* Action Button Column */}
        <div className="md:col-span-1.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <span>Add</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
