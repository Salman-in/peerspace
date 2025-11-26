import {
  UserButton,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2a2a2a] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-medium text-[#e8e8e8] tracking-tight hover:text-[#d4a574] transition"
            >
              PeerSpace
            </Link>
          </div>

          {/* Navigation / Auth */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-[#8e8e8e] hover:text-[#e8e8e8] px-3 py-2 rounded-md text-sm font-medium transition">
                    Sign in
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="bg-[#d4a574] text-[#1a1a1a] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#c49564] transition">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
