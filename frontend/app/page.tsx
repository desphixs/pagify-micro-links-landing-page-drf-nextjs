import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between font-sans transition-colors duration-300">
            <Header />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 justify-center">
                {/* LEFT COLUMN: Value Proposition */}
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            Everything you are <br />
                            <span className="text-emerald-600 dark:text-emerald-500 underline decoration-emerald-200">in one simple link.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">Join Sarah and thousands of creators. Build a beautiful, high-converting landing page for your brand in minutes. No coding required.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-200 dark:shadow-none">Claim your Pagify link</button>
                        <button className="px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">View Examples</button>
                    </div>

                    <p className="text-sm text-zinc-500">Free forever. Upgrade for custom domains.</p>
                </div>

                {/* RIGHT COLUMN: The "Sarah" Mockup Preview */}
                <div className="flex-1 w-full max-w-md relative">
                    <div className="bg-white dark:bg-zinc-900 h-[40rem] w-[20rem] border-[8px] border-zinc-900 dark:border-zinc-800 rounded-[3rem] shadow-2xl aspect-[9/19] overflow-hidden flex flex-col items-center p-8">
                        {/* Mockup Profile Header */}
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-emerald-500 p-1">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" alt="Sarah - Graphic Designer" fill sizes="128px" className="object-cover object-center" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Sarah Jenkins</h2>
                        <p className="text-sm text-zinc-500 mb-8 font-medium">@sarahcreates • Graphic Designer</p>

                        {/* Mockup Links */}
                        <div className="w-full space-y-4">
                            {[
                                { label: "My Design Portfolio", color: "bg-zinc-100 dark:bg-zinc-800" },
                                { label: "Latest Prints (Shop)", color: "bg-zinc-100 dark:bg-zinc-800" },
                                { label: "Read my Blog", color: "bg-zinc-100 dark:bg-zinc-800" },
                                { label: "Work with Me", color: "bg-emerald-600 text-white" },
                            ].map((link, i) => (
                                <div key={i} className={`w-full py-4 rounded-xl text-black text-center dark:text-white font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity ${link.color}`}>
                                    {link.label}
                                </div>
                            ))}
                        </div>

                        {/* Social Icons (SVG) */}
                        <div className="flex gap-6 mt-12">
                            {/* Instagram */}
                            <svg className="w-6 h-6 text-zinc-400 hover:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            {/* Twitter/X */}
                            <svg className="w-6 h-6 text-zinc-400 hover:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            {/* LinkedIn */}
                            <svg className="w-6 h-6 text-zinc-400 hover:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </div>

                        <div className="mt-auto py-4">
                            <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">Pagify</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <p>&copy; {new Date().getFullYear()} Pagify Inc. Built for learning full-stack mastery.</p>
                <p className="mt-2 sm:mt-0 font-medium text-emerald-600/70">Secure Server-first Architecture</p>
            </footer>
        </div>
    );
}
