"use client";

const testimonials = [
  {
    name: "Sarah Johnson",
    course: "CSC 648",
    text: "Found an amazing tutor who helped me understand web development. Went from a C to an A!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    course: "MATH 226",
    text: "The tutors here are patient and really know their stuff. Highly recommend!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    course: "BIOL 240",
    text: "Finally understood cell biology thanks to my tutor. Worth every penny!",
    rating: 5,
  },
  {
    name: "David Kim",
    course: "CSC 413",
    text: "Great platform! My tutor explained algorithms in a way that finally clicked.",
    rating: 5,
  },
  {
    name: "Jessica Lee",
    course: "PHYS 220",
    text: "Physics isn't scary anymore. My tutor made it so much easier to understand.",
    rating: 5,
  },
  {
    name: "Alex Martinez",
    course: "CHEM 115",
    text: "Best decision I made this semester. My grades improved significantly!",
    rating: 5,
  },
  {
    name: "Rachel Green",
    course: "CSC 415",
    text: "Operating systems tutor was incredibly knowledgeable and helpful.",
    rating: 5,
  },
  {
    name: "Thomas Wang",
    course: "MATH 370",
    text: "Discrete math became manageable with the right tutor. Thank you!",
    rating: 5,
  },
];

// Duplicate testimonials for seamless infinite scroll
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function TestimonialsScroll() {
  return (
    <section className="py-12 sm:py-16 bg-muted/30 overflow-hidden relative">
      {/* Blur gradients on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      {/* Section Title */}
      <div className="text-center mb-8 px-4">
        <h2 className="section-heading font-semibold text-foreground mb-2">
          What Students Say
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Join thousands of students who found success
        </p>
      </div>

      {/* Scrolling Container */}
      <div className="relative">
        <div className="flex animate-scroll-testimonials">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="flex-shrink-0 w-[350px] mx-4"
            >
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-primary"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.course}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
