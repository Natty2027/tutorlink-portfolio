"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";

export function ItemGrid({ items }) {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactClick = (e, tutor) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <p className="text-lg font-medium text-muted-foreground">
            No tutors found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Tutor listings"
      >
        {items.map((item) => (
          <article key={item.post_id} role="listitem" className="flex flex-col">
            <Card className="transition-shadow hover:shadow-lg flex flex-col h-full">
              <Link
                href={`/tutor/${item.post_id}`}
                className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                aria-label={`View ${item.name_first} ${item.name_last}'s tutoring profile for ${item.course_code}: ${item.course_name}`}
              >
                <CardHeader>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                      {item.profile_image_data ? (
                        <Image
                          src={item.profile_image_data}
                          alt={`${item.name_first} ${item.name_last}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground"
                          aria-hidden="true"
                        >
                          {item.name_first?.[0]}
                          {item.name_last?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">
                        {item.name_first} {item.name_last}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.year} • {item.major}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                      {item.department}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ${item.hourly_rate}/hr
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {item.course_code}: {item.course_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="leading-relaxed mb-3 flex-1">
                    {item.bio_intro}
                  </CardDescription>
                  {item.availability_text && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Available:</span>{" "}
                        {item.availability_text}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Link>
              <div className="px-6 pb-6 pt-4 border-t border-border">
                <Button
                  className="w-full"
                  onClick={(e) => handleContactClick(e, item)}
                  aria-label={`Contact ${item.name_first} ${item.name_last} about tutoring for ${item.course_code}`}
                >
                  Contact Me
                </Button>
              </div>
            </Card>
          </article>
        ))}
      </div>

      {selectedTutor && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tutor={selectedTutor}
        />
      )}
    </>
  );
}
