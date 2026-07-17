"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";
import { API_URL } from "@/config/api";

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.post_id;
  const [tutorPost, setTutorPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchTutorPost();
    }
  }, [postId]);

  const fetchTutorPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/tutor-posts/${postId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Tutor post not found");
        }
        throw new Error("Failed to fetch tutor post");
      }

      const data = await response.json();
      setTutorPost(data);
    } catch (err) {
      console.error("Error fetching tutor post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-muted-foreground">Loading tutor profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !tutorPost) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <p className="text-lg font-medium text-red-500 mb-2">
              {error || "Tutor post not found"}
            </p>
            <Link href="/home">
              <Button variant="outline">Back to Search</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Search
          </Link>
        </div>

        {/* Tutor Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted ring-2 ring-border/50">
              {tutorPost.profile_image_data || tutorPost.profile_image_url ? (
                <Image
                  src={
                    tutorPost.profile_image_data || tutorPost.profile_image_url
                  }
                  alt={`${tutorPost.name_first} ${tutorPost.name_last}`}
                  fill
                  className="object-cover"
                  unoptimized={!!tutorPost.profile_image_data}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                  {tutorPost.name_first?.[0]}
                  {tutorPost.name_last?.[0]}
                </div>
              )}
            </div>

            {/* Tutor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {tutorPost.name_first} {tutorPost.name_last}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {tutorPost.year && tutorPost.major
                      ? `${tutorPost.year} · ${tutorPost.major}`
                      : tutorPost.year || tutorPost.major || ""}
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleContactClick}
                  className="shrink-0 font-medium"
                >
                  Contact Tutor
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 items-center mt-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {tutorPost.department}
                </span>
                {tutorPost.gpa && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    GPA: {tutorPost.gpa}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                  ${tutorPost.hourly_rate || "N/A"}/hr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card */}
        <Card className="mb-6 border-border/50">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {tutorPost.course_code}: {tutorPost.course_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tutorPost.department} Department
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {tutorPost.bio_intro || "No bio available."}
            </p>
          </CardContent>
        </Card>

        {/* Availability Section */}
        {tutorPost.availability_text && (
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {tutorPost.availability_text}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contact Modal */}
        {tutorPost && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            tutor={tutorPost}
          />
        )}
      </div>
    </main>
  );
}
