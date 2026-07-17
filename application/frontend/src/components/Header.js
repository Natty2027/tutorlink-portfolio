"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (query, category) => {
    const params = new URLSearchParams();
    if (query && query.trim()) {
      params.append("query", query.trim());
    }
    if (category && category !== "all") {
      params.append("category", category);
    }

    const queryString = params.toString();
    router.push(`/home${queryString ? `?${queryString}` : ""}`);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/home", label: "Find Tutors" },
    ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/about-team", label: "About Team" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="SFSU Tutoring - Go to home page"
            >
              <Image
                src="/tutorlink-logo.png"
                alt="SFSU Tutoring logo"
                width={150}
                height={40}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* Amazon-style Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-3xl">
              <SearchBar
                onSearch={handleSearch}
                initialQuery={searchParams.get("query") || ""}
                initialCategory={searchParams.get("category") || "all"}
              />
            </div>

            {/* Navigation and Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
              <nav
                className="hidden lg:flex lg:gap-6"
                aria-label="Main navigation"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`text-sm font-medium transition-colors hover:text-foreground whitespace-nowrap ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                {loading ? (
                  <div className="h-9 w-20 animate-pulse bg-muted rounded" />
                ) : isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Hi, {user?.name_first}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-3 md:hidden">
            <SearchBar
              onSearch={handleSearch}
              initialQuery={searchParams.get("query") || ""}
              initialCategory={searchParams.get("category") || "all"}
            />
          </div>
        </div>
      </header>

      {/* Mobile Side Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
        role="presentation"
      />

      {/* Mobile Side Menu Panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed top-0 left-0 z-[70] h-full w-72 bg-background border-r border-border shadow-xl transform transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="SFSU Tutoring - Go to home page"
          >
            <Image
              src="/tutorlink-logo.png"
              alt="SFSU Tutoring logo"
              width={120}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
          <button
            type="button"
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* User Greeting */}
        {isAuthenticated && user && (
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-medium text-foreground">
              {user.name_first} {user.name_last}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav
          className="flex flex-col p-4 space-y-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          {loading ? (
            <div className="h-10 w-full animate-pulse bg-muted rounded" />
          ) : isAuthenticated ? (
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
