"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateTutorPostPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    course_code: "",
    bio_intro: "",
    availability_text: "",
    hourly_rate: "",
    gpa: "",
    year: "",
    major: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`${API_URL}/api/courses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourseChange = (value) => {
    setFormData({
      ...formData,
      course_code: value,
    });
  };

  const handleYearChange = (value) => {
    setFormData({
      ...formData,
      year: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Frontend validation
    if (!formData.course_code || !formData.bio_intro) {
      setError("Please select a course and write a bio");
      setLoading(false);
      return;
    }

    if (formData.bio_intro.length < 50) {
      setError("Bio should be at least 50 characters");
      setLoading(false);
      return;
    }

    // Validate hourly rate if provided
    if (formData.hourly_rate) {
      const rate = parseFloat(formData.hourly_rate);
      if (isNaN(rate) || rate <= 0) {
        setError("Please enter a valid hourly rate");
        setLoading(false);
        return;
      }
    }

    // Validate GPA if provided
    if (formData.gpa) {
      const gpa = parseFloat(formData.gpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        setError("Please enter a valid GPA (0.00 - 4.00)");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/tutor-posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutor_id: user.user_id,
          course_code: formData.course_code,
          bio_intro: formData.bio_intro,
          availability_text: formData.availability_text || null,
          hourly_rate: formData.hourly_rate
            ? parseFloat(formData.hourly_rate)
            : null,
          gpa: formData.gpa ? parseFloat(formData.gpa) : null,
          year: formData.year || null,
          major: formData.major || null,
          profile_image_data: profileImage || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create tutor post");
      }

      setSuccess(
        "Tutor post created successfully! It will be visible after admin approval."
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create tutor post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create Tutor Post
          </h1>
          <p className="text-muted-foreground">
            Share your expertise and start offering tutoring services. Posts
            require admin approval before becoming visible.
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tutor Profile Information</CardTitle>
            <CardDescription>
              Fill in your details to create your tutor profile for a specific
              course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div
                  className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-600"
                  role="status"
                  aria-live="polite"
                >
                  {success}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-image-input"
                  className="text-sm font-medium"
                >
                  Profile Picture
                </label>
                <div className="flex flex-col items-start gap-4">
                  {/* Preview */}
                  <div
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted border-2 border-dashed border-border"
                    aria-label={
                      profileImagePreview
                        ? "Profile image preview"
                        : "No profile image uploaded"
                    }
                  >
                    {profileImagePreview ? (
                      <Image
                        src={profileImagePreview}
                        alt="Your profile picture preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-muted-foreground"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                      id="profile-image-input"
                      disabled={loading}
                      aria-describedby="image-requirements"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      aria-label={
                        profileImagePreview
                          ? "Change profile photo"
                          : "Upload profile photo"
                      }
                    >
                      {profileImagePreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    {profileImagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        aria-label="Remove profile photo"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p
                  id="image-requirements"
                  className="text-xs text-muted-foreground"
                >
                  Upload a professional photo (JPEG, PNG, GIF, or WebP, max 5MB)
                </p>
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <label id="course-label" className="text-sm font-medium">
                  Course{" "}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <Select
                  value={formData.course_code}
                  onValueChange={handleCourseChange}
                  disabled={loading || coursesLoading}
                  aria-labelledby="course-label"
                  required
                >
                  <SelectTrigger
                    className="w-full"
                    aria-label="Select a course to tutor"
                  >
                    <SelectValue
                      placeholder={
                        coursesLoading
                          ? "Loading courses..."
                          : "Select a course to tutor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course.course_code}
                        value={course.course_code}
                      >
                        {course.course_code} - {course.course_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the course you want to offer tutoring for
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio_intro" className="text-sm font-medium">
                  Bio / Introduction <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="bio_intro"
                  name="bio_intro"
                  placeholder="Tell students about your experience with this course, your teaching style, and why you'd be a great tutor... (minimum 50 characters)"
                  value={formData.bio_intro}
                  onChange={handleChange}
                  disabled={loading}
                  rows={5}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio_intro.length} characters (minimum 50 required)
                </p>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label
                  htmlFor="availability_text"
                  className="text-sm font-medium"
                >
                  Availability
                </label>
                <Textarea
                  id="availability_text"
                  name="availability_text"
                  placeholder="e.g., Weekdays after 4pm, Weekends anytime"
                  value={formData.availability_text}
                  onChange={handleChange}
                  disabled={loading}
                  rows={2}
                />
              </div>

              {/* Hourly Rate and GPA */}
              <div className="flex flex-col gap-4">
                {/* Hourly Rate */}
                <div className="space-y-2">
                  <label htmlFor="hourly_rate" className="text-sm font-medium">
                    Hourly Rate (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="hourly_rate"
                      name="hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                      disabled={loading}
                      className="pl-7"
                    />
                  </div>
                </div>

                {/* GPA */}
                <div className="space-y-2">
                  <label htmlFor="gpa" className="text-sm font-medium">
                    Your GPA in this course
                  </label>
                  <Input
                    id="gpa"
                    name="gpa"
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    placeholder="3.85"
                    value={formData.gpa}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Year and Major */}
              <div className="flex flex-col gap-4">
                {/* Year */}
                <div className="space-y-2">
                  <label id="year-label" className="text-sm font-medium">
                    Academic Year
                  </label>
                  <Select
                    value={formData.year}
                    onValueChange={handleYearChange}
                    disabled={loading}
                    aria-labelledby="year-label"
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-label="Select your academic year"
                    >
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Graduate">Graduate Student</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Major */}
                <div className="space-y-2">
                  <label htmlFor="major" className="text-sm font-medium">
                    Major
                  </label>
                  <Input
                    id="major"
                    name="major"
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <strong>Note:</strong> Your tutor post will be reviewed by an
                admin before it becomes visible to students. This typically
                takes 1-2 business days.
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Post..." : "Create Tutor Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
