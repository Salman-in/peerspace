'use client';

import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { MessageSquare, Bot, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8]">
      <main className="relative overflow-hidden pb-16">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 sm:pt-28 lg:pt-36 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight text-[#e8e8e8]">
              Connect. Collaborate. Grow.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-[#8e8e8e] max-w-2xl mx-auto px-4">
              Join <span className="font-medium text-[#d4a574]">PeerSpace</span>, 
              your digital campus hub for connecting with classmates, sharing resources, 
              and discovering exciting events around you.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto rounded-md bg-[#d4a574] px-5 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#c49564]">
                    Get Started
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto text-sm font-medium text-[#8e8e8e] hover:text-[#e8e8e8] transition py-3">
                    Sign In <span aria-hidden="true">→</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full rounded-md bg-[#d4a574] px-5 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#c49564]">
                    Go to Dashboard
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto mt-4 sm:mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center px-4">
            <h2 className="text-sm sm:text-base font-medium leading-7 text-[#d4a574] uppercase tracking-wide">
              Everything You Need
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#e8e8e8]">
              Features That Empower Your Campus Life
            </p>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#8e8e8e] max-w-2xl mx-auto">
              Designed to help you make the most out of your student experience.
            </p>
          </div>

          {/* Feature Boxes */}
          <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Box 1 */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all">
              <div className="p-3 bg-[#2a2a2a] rounded-lg mb-3 sm:mb-4">
                <MessageSquare className="h-8 w-8 text-[#d4a574]" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-[#e8e8e8] mb-2 sm:mb-3">
                Community Chat
              </h3>
              <p className="text-[#8e8e8e] text-sm sm:text-base">
                Connect with your classmates in real-time. Share ideas, 
                ask questions, and build meaningful relationships.
              </p>
            </div>

            {/* Box 2 */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all">
              <div className="p-3 bg-[#2a2a2a] rounded-lg mb-3 sm:mb-4">
                <Bot className="h-8 w-8 text-[#d4a574]" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-[#e8e8e8] mb-2 sm:mb-3">
                PeerAI Assistant
              </h3>
              <p className="text-[#8e8e8e] text-sm sm:text-base">
                Get instant answers about your college, departments, facilities, 
                and more with our AI-powered assistant.
              </p>
            </div>

            {/* Box 3 */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#d4a574]/30 transition-all sm:col-span-2 lg:col-span-1">
              <div className="p-3 bg-[#2a2a2a] rounded-lg mb-3 sm:mb-4">
                <MapPin className="h-8 w-8 text-[#d4a574]" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-[#e8e8e8] mb-2 sm:mb-3">
                Campus Navigation
              </h3>
              <p className="text-[#8e8e8e] text-sm sm:text-base">
                Find department locations, labs, seminar halls, and facilities 
                across your campus with ease.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
