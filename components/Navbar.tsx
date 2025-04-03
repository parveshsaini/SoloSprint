"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, Home, LogIn, LogOut, Menu, X, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface NavbarProps {
  isAuthenticated: boolean;
  userName?: string;
  userImage?: string;
  onSignOut: () => void;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { status, data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PanelLeft className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline-block">SoloSprint</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          {status == 'authenticated' ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                    <img
                      src={session.user?.image}
                      alt={session.user?.image || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>
              <Link href="api/auth/signout">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="api/auth/signin">
              <Button size="sm" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-2 font-semibold">
                <PanelLeft className="h-5 w-5 text-primary" />
                <span>TaskFlow</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4 mt-6">
              <Link
                href="/"
                className="flex items-center gap-2 py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Features</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Pricing</span>
              </Link>
              {status== 'authenticated' ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    {session.user?.image && (
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                        <img
                          src={session.user?.image}
                          alt={session.user?.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full justify-start gap-2">
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link href="/api/auth/signout" >
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2 mt-2"
                   
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </Button>
                  </Link>
                </>
              ) : (
                <Link
                  href="api/auth/signin"
                  className="flex w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full justify-start gap-2">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
