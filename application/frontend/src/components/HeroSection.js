"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { API_URL } from "@/config/api";

export default function HeroSection() {
  const [tutorCount, setTutorCount] = useState(0);

  useEffect(() => {
    // Fetch tutor count
    const fetchTutorCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vp-search`);
        if (response.ok) {
          const data = await response.json();
          setTutorCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching tutor count:", error);
      }
    };
    fetchTutorCount();
  }, []);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      {/* Two Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="max-w-xl">
            {/* Main Heading with underline effect */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find the{" "}
              <span className="relative inline-block">perfect tutor</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect with qualified SFSU peer tutors who excel in your courses.
              Get personalized help and ace your exams.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-12">
              <Link href="/home">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-[#86efac] hover:bg-[#6ee89b] text-black font-semibold"
                >
                  Explore our tutors
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-2"
                >
                  Create an account
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 pb-8 border-b border-border">
              <div>
                <div className="text-4xl font-bold text-foreground mb-1">
                  {tutorCount}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Available tutors
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-1">
                  ~500
                </div>
                <div className="text-sm text-muted-foreground">
                  Students helped
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-foreground text-foreground"
                  />
                ))}
                <Star className="w-6 h-6 fill-foreground text-foreground opacity-50" />
              </div>
              <span className="text-2xl font-bold text-foreground">4.5</span>
              <span className="text-sm text-muted-foreground">
                Average student rating
              </span>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-[600px]">
              <Image
                src="/hero-img.png"
                alt="Hero Illustration"
                width={600}
                height={600}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
