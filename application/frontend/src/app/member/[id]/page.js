"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MemberPage() {
  const params = useParams();
  const [imageError, setImageError] = useState(false);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMember() {
      try {
        const response = await fetch(`/api/team/${params.id}`);
        const result = await response.json();

        if (response.status === 404) {
          notFound();
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to fetch team member");
        }

        setMember(result.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching team member:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="body-text text-neutral-medium">
            Loading member details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="body-text text-red-600">
            Error: {error || "Member not found"}
          </p>
          <Link
            href="/"
            className="text-accent-blue hover:underline mt-4 inline-block"
          >
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white py-6 px-6 border-b border-neutral-light">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-medium hover:text-accent-blue transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Team
          </Link>
        </div>
      </div>

      {/* Member Details */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                  {!imageError ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="section-heading text-neutral-dark mb-2">
                {member.name}
              </h1>
              <p className="body-text text-accent-blue font-medium mb-4">
                {member.title}
              </p>
              <p className="body-text text-neutral-medium mb-6">{member.bio}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mb-8">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-medium hover:text-accent-blue transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-medium hover:text-neutral-dark transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-neutral-medium hover:text-accent-blue transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid md:grid-cols-1 gap-8">
              {/* About Section */}
              <div className="mb-8">
                <h2 className="section-heading text-neutral-dark mb-4">
                  About
                </h2>
                <p className="body-text text-neutral-medium leading-relaxed">
                  {member.detailedBio}
                </p>
              </div>

              {/* Education */}
              {member.education && (
                <div className="mb-8">
                  <h2 className="section-heading text-neutral-dark mb-4">
                    Education
                  </h2>
                  <p className="body-text text-neutral-medium">
                    {member.education}
                  </p>
                </div>
              )}

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="section-heading text-neutral-dark mb-4">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-neutral-light text-neutral-dark body-text rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {member.interests && member.interests.length > 0 && (
                <div className="mb-8">
                  <h2 className="section-heading text-neutral-dark mb-4">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {member.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-accent-blue/10 text-accent-blue body-text rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
