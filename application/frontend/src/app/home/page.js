"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { ItemGrid } from "@/components/ItemGrid";
import { API_URL } from "@/config/api";

export default function Home() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  const urlCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [tutorPosts, setTutorPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tutor posts when URL params change (from navbar search)
  useEffect(() => {
    setSearchQuery(urlQuery);
    setSelectedCategory(urlCategory);
    fetchTutorPosts(urlQuery, urlCategory);
  }, [urlQuery, urlCategory]);

  const fetchTutorPosts = async (query, category) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query && query.trim()) {
        params.append("query", query.trim());
      }
      if (category && category !== "all") {
        params.append("category", category);
      }

      const url = `${API_URL}/api/vp-search${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch tutor posts");
      }

      const data = await response.json();
      setTutorPosts(data.data || []);
    } catch (err) {
      console.error("Error fetching tutor posts:", err);
      setError(err.message);
      setTutorPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    fetchTutorPosts(query, category);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
            Find Your Tutor
          </h1>
          <p className="text-muted-foreground">
            Search for peer tutors by course, department, or topic
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            initialQuery={searchQuery}
            initialCategory={selectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error: {error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {tutorPosts.length} {tutorPosts.length === 1 ? "tutor" : "tutors"}{" "}
              found
            </p>
          )}
        </div>

        {/* Items Grid */}
        {!loading && !error && <ItemGrid items={tutorPosts} />}
      </div>
    </main>
  );
}
