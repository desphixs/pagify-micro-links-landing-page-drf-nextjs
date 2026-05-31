'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2, X, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { updateLinkAction } from '@/app/actions/links/links';

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
interface EditLinkFormProps {
  link: LinkData;                             // The current link object that we are editing
  onSuccess: (updatedLink: LinkData) => void; // Callback to notify the parent list that the update succeeded
  onCancel: () => void;                       // Callback to close the edit form mode
}

/**
 * EDIT LINK FORM COMPONENT
 * 
 * Analogy:
 * Think of this component like a dedicated "Tuning Controller" block.
 * When you slide a speaker card (a Link) into Edit Mode, we drop this tuning panel right in place.
 * It pre-populates its controls (local states for title, url, order, active switch) with the speaker's
 * current settings. When you click "Save Changes", it sends the update request securely to the backend.
 * Once Django confirms the save, this component fires the "onSuccess" callback wire to deliver
 * the fresh validated data back to the main control deck!
 */
export default function EditLinkForm({ link, onSuccess, onCancel }: EditLinkFormProps) {
  // Local state hooks initialized with the current link values to capture user keystrokes
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [order, setOrder] = useState(link.order.toString());
  const [isActive, setIsActive] = useState(link.is_active);

  // Local state hook to track if the network request is currently loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state hook to capture and show backend validation error alerts in-place
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form submission handler
  const handleUpdateLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // Front-end sanity check: Prevent submitting blank titles or URLs
    if (!title.trim() || !url.trim()) {
      setErrorMsg("Both Link Title and URL destination are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Dispatch our secure Server Action to query Django's PUT update view
      const res = await updateLinkAction(
        link.id,
        title.trim(),
        url.trim(),
        parseInt(order) || 0,
        isActive
      );

      if (res.success && res.link) {
        // 2. Trigger success toast notification
        toast.success("Social link updated successfully!");
        // 3. Pass the fresh database object to the parent's update handler callback
        onSuccess(res.link as LinkData);
      } else {
        // 4. If the backend manual validations reject the payload, display the alert
        setErrorMsg(res.message || "Failed to update link details.");
        toast.error(res.message || "Failed to update link details.");
      }
    } catch (err: any) {
      // 5. Catch unexpected connection faults
      setErrorMsg("Failed to connect to backend server. Check your network connection.");
      toast.error("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-5 space-y-4 animate-in fade-in duration-200 shadow-sm">
      
      {/* Form Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-150 dark:border-zinc-850">
        <h2 className="text-[10px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 flex items-center gap-1.5">
          <Sparkles size={12} className="text-zinc-400" />
          <span>Edit Social Link Details</span>
        </h2>
        <button
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
          className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
          title="Cancel Editing"
        >
          <X size={14} />
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

      {/* Inline Input Fields */}
      <form onSubmit={handleUpdateLinkSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Title Input Column */}
          <div className="space-y-1.5 md:col-span-1">
            <label htmlFor={`edit-title-${link.id}`} className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-450">
              Title
            </label>
            <input
              id={`edit-title-${link.id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. My Website"
              className="w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white disabled:opacity-50"
              required
            />
          </div>

          {/* URL Input Column */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor={`edit-url-${link.id}`} className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-450">
              Destination URL
            </label>
            <input
              id={`edit-url-${link.id}`}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white rounded-xl text-xs font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white disabled:opacity-50"
              required
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Order Input Column */}
          <div className="space-y-1.5">
            <label htmlFor={`edit-order-${link.id}`} className="block text-[9px] font-black uppercase tracking-wider text-zinc-555 dark:text-zinc-400">
              Display Order
            </label>
            <input
              id={`edit-order-${link.id}`}
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-white rounded-xl text-xs font-medium text-zinc-900 dark:text-white outline-none transition-all focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white disabled:opacity-50"
            />
          </div>

          {/* Visibility Switch Checkbox */}
          <div className="flex items-end pb-2 md:col-span-2">
            <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
                className="h-4.5 w-4.5 rounded-lg border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white focus:ring-zinc-950 focus:ring-offset-0 transition-all disabled:opacity-50"
              />
              <span>Show on Public Profile</span>
            </label>
          </div>

        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            type="button"
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-zinc-750 dark:text-zinc-300 cursor-pointer disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 transition-all shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
