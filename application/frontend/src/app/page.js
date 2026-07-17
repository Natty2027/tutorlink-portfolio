import HeroSection from "@/components/HeroSection";
import TestimonialsScroll from "@/components/TestimonialsScroll";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Testimonials */}
      <TestimonialsScroll />
    </main>
  );
}
