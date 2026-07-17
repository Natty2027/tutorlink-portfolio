"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Fetch user's tutor posts
  useEffect(() => {
    async function fetchMyPosts() {
      if (!user?.user_id) return;

      try {
        const response = await fetch(
          `${API_URL}/api/tutor-posts/my-posts?user_id=${user.user_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setMyPosts(data);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Failed to fetch my posts:", err);
        setPostsError(err.message);
      } finally {
        setPostsLoading(false);
      }
    }

    if (user?.user_id) {
      fetchMyPosts();
    }
  }, [user?.user_id]);

  // Fetch messages for this tutor
  useEffect(() => {
    async function fetchMessages() {
      if (!user?.user_id) return;

      try {
        const response = await fetch(
          `${API_URL}/api/requests/my-messages?user_id=${user.user_id}`
        );
        const data = await response.json();
        // Even if response is not ok, we might just have no messages
        // Only set error for actual server errors
        if (response.ok) {
          setMessages(data || []);
        } else if (response.status >= 500) {
          setMessagesError(data.error || "Server error");
        } else {
          // For 400 errors, just show empty (likely no messages)
          setMessages([]);
        }
      } catch (err) {
        // Network errors - just show empty, don't break the page
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    }

    if (user?.user_id) {
      fetchMessages();
    }
  }, [user?.user_id]);

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {user?.name_first || "User"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-10 flex flex-wrap gap-3">
          <Link href="/home">
            <Button
              variant="default"
              size="lg"
              className="bg-black hover:bg-black/90"
            >
              Find Tutors
            </Button>
          </Link>
          <Link href="/create-post">
            <Button variant="outline" size="lg">
              Create Post
            </Button>
          </Link>
        </div>

        {/* My Courses Section */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              My Tutor Posts
            </h2>
            <Link href="/create-post">
              <Button variant="outline" size="sm">
                + New Post
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <Card>
              <CardContent className="flex min-h-[150px] items-center justify-center p-8">
                <div className="text-muted-foreground">
                  Loading your posts...
                </div>
              </CardContent>
            </Card>
          ) : postsError ? (
            <Card>
              <CardContent className="flex min-h-[150px] items-center justify-center p-8">
                <div className="text-red-500">
                  Error loading posts: {postsError}
                </div>
              </CardContent>
            </Card>
          ) : myPosts.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[150px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-3 text-4xl opacity-40">📚</div>
                <p className="text-muted-foreground mb-4">
                  You haven't created any tutor posts yet
                </p>
                <Link href="/create-post">
                  <Button>Create Your First Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myPosts.map((post) => (
                <Card
                  key={post.post_id}
                  className={`relative overflow-hidden ${
                    post.is_live
                      ? "border-green-200"
                      : "border-amber-200 bg-amber-50/30"
                  }`}
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium ${
                      post.is_live
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {post.is_live ? "✓ Approved" : "⏳ Pending"}
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold pr-20">
                      {post.course_code}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.course_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.bio_intro}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {post.hourly_rate && (
                        <span className="bg-muted px-2 py-1 rounded">
                          ${post.hourly_rate}/hr
                        </span>
                      )}
                      {post.gpa && (
                        <span className="bg-muted px-2 py-1 rounded">
                          GPA: {post.gpa}
                        </span>
                      )}
                      {post.year && (
                        <span className="bg-muted px-2 py-1 rounded">
                          {post.year}
                        </span>
                      )}
                    </div>
                    {!post.is_live && (
                      <p className="mt-3 text-xs text-amber-600">
                        Your post is being reviewed by an admin
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Message Box
            </h2>
            {messages.length > 0 && (
              <span className="rounded-full bg-indigo-100 text-indigo-700 px-4 py-1.5 text-sm font-medium">
                {messages.length} message{messages.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {messagesLoading ? (
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
              <div className="flex min-h-[150px] items-center justify-center">
                <div className="text-muted-foreground">Loading messages...</div>
              </div>
            </div>
          ) : messagesError ? (
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
              <div className="flex min-h-[150px] items-center justify-center">
                <div className="text-red-500">
                  Error loading messages: {messagesError}
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/30 p-10 shadow-lg border border-gray-100 max-w-md">
              <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                  <svg
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  No messages yet
                </p>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  When students contact you about tutoring, their messages will
                  appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {messages.map((msg) => (
                <div
                  key={msg.request_id}
                  className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/20 p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Header with title and date */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Tutoring Request
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Request
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                      {msg.course_code}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-600">
                      {msg.course_name}
                    </span>
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span>{" "}
                      <span className="font-semibold text-gray-900">
                        {msg.sender_first_name} {msg.sender_last_name}
                      </span>
                    </div>
                    <div className="text-gray-300">|</div>
                    <div>
                      <span className="text-gray-500">Contact:</span>{" "}
                      <a
                        href={
                          msg.student_contact.includes("@")
                            ? `mailto:${msg.student_contact}`
                            : `tel:${msg.student_contact}`
                        }
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        {msg.student_contact}
                      </a>
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="rounded-xl bg-gray-50/80 p-5 border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Action button */}
                  <div className="mt-5 flex justify-end">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-full"
                      onClick={() => {
                        const contactLink = msg.student_contact.includes("@")
                          ? `mailto:${msg.student_contact}?subject=Re: Tutoring for ${msg.course_code}`
                          : `tel:${msg.student_contact}`;
                        window.open(contactLink, "_blank");
                      }}
                    >
                      {msg.student_contact.includes("@")
                        ? "Reply via Email"
                        : "Call Student"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
