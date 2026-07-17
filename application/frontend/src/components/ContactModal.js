"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";

export default function ContactModal({ isOpen, onClose, tutor }) {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setContactMethod("email");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!message.trim()) {
      setError("Please enter a message");
      setLoading(false);
      return;
    }

    // Get contact info based on selected method
    const contactInfo =
      contactMethod === "email" ? user.email : user.contact_phone || user.email; // Fallback to email if no phone

    // Debug: log what we're sending
    const requestData = {
      requester_user_id: user.user_id,
      tutor_id: tutor.tutor_id,
      post_id: tutor.post_id,
      course_code: tutor.course_code,
      student_contact: contactInfo,
      message: message.trim(),
    };
    console.log("Sending request:", requestData);
    console.log("Tutor object:", tutor);

    try {
      const response = await fetch(`${API_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMessage("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  // Not logged in state
  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to contact a tutor.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Please log in or create an account to send a message to{" "}
              {tutor.name_first} {tutor.name_last}.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Contact {tutor.name_first} {tutor.name_last}
          </DialogTitle>
          <DialogDescription>
            Send a message about tutoring for {tutor.course_code}:{" "}
            {tutor.course_name}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center" role="status" aria-live="polite">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">Message Sent!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {tutor.name_first} will see your message in their dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* From info - auto-filled */}
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <span className="text-muted-foreground">From:</span>{" "}
                <span className="font-medium">
                  {user.name_first} {user.name_last}
                </span>
              </p>
            </div>

            {/* Contact Method Selection */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">
                How should they contact you?
              </legend>
              <div
                className="flex gap-4"
                role="radiogroup"
                aria-label="Contact method preference"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={contactMethod === "email"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="h-4 w-4"
                    disabled={loading}
                    aria-label={`Contact via email: ${user.email}`}
                  />
                  <span className="text-sm">Email ({user.email})</span>
                </label>
                {user.contact_phone && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={contactMethod === "phone"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="h-4 w-4"
                      disabled={loading}
                      aria-label={`Contact via phone: ${user.contact_phone}`}
                    />
                    <span className="text-sm">
                      Phone ({user.contact_phone})
                    </span>
                  </label>
                )}
              </div>
            </fieldset>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Hi! I'm interested in tutoring sessions for this course. When are you available?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                rows={5}
                required
                aria-required="true"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
