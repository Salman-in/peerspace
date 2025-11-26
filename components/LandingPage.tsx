'use client';

import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8]">
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 sm:pt-28 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-[#e8e8e8] sm:text-6xl">
              Connect. Collaborate. Grow.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#8e8e8e] max-w-2xl mx-auto">
              Join <span className="font-medium text-[#d4a574]">PeerSpace</span> — 
              your digital campus hub for connecting with classmates, sharing resources, 
              and discovering exciting events around you.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-[#d4a574] px-5 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#c49564]">
                    Get Started
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-[#8e8e8e] hover:text-[#e8e8e8] transition">
                    Sign In <span aria-hidden="true">→</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard">
                  <button className="rounded-md bg-[#d4a574] px-5 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#c49564]">
                    Go to Dashboard
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-medium leading-7 text-[#d4a574] uppercase tracking-wide">
              Everything You Need
            </h2>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#e8e8e8] sm:text-4xl">
              Features That Empower Your Campus Life
            </p>
            <p className="mt-4 text-lg text-[#8e8e8e] max-w-2xl mx-auto">
              Designed to help you make the most out of your student experience.
            </p>
          </div>

          {/* Feature Boxes */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Box 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-medium text-[#e8e8e8] mb-3">
                Connect with Peers
              </h3>
              <p className="text-[#8e8e8e] text-base">
                Discover and connect with students who share your passions, 
                courses, and goals — all within your campus network.
              </p>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-medium text-[#e8e8e8] mb-3">
                Share Resources
              </h3>
              <p className="text-[#8e8e8e] text-base">
                Exchange notes, study materials, and valuable insights to support 
                each other's learning journey.
              </p>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-medium text-[#e8e8e8] mb-3">
                Stay in the Loop
              </h3>
              <p className="text-[#8e8e8e] text-base">
                Keep track of campus happenings — from academic sessions 
                to club events and exciting new opportunities.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
