"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { API_URL } from "@/config/api";

export default function SearchBar({
  onSearch,
  initialQuery = "",
  initialCategory = "all",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);
  const listboxId = "search-suggestions-listbox";

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  // Fetch departments from API on mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch(`${API_URL}/api/courses/departments`);
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        // Fallback to empty array - will just show "All Departments"
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(
    async (searchQuery) => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("query", searchQuery.trim());
        if (category && category !== "all") {
          params.append("category", category);
        }

        const response = await fetch(
          `${API_URL}/api/vp-search?${params.toString()}`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.data || []);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // Debounced search
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search (dropdown only)
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (query.trim().length >= 2) {
      fetchSuggestions(query);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSearch(query, category);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion.course_code || suggestion.title || "";
    setQuery(searchText);
    setShowDropdown(false);
    onSearch(searchText, category);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Get suggestion ID for ARIA
  const getSuggestionId = (index) => `search-suggestion-${index}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full"
      ref={searchRef}
      role="search"
      aria-label="Search for tutors"
    >
      {/* Amazon-style integrated search bar */}
      <div className="relative flex items-stretch rounded-lg overflow-hidden border border-border bg-background hover:border-primary transition-colors">
        {/* Category Dropdown - Left Side */}
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger
            className="w-[140px] sm:w-[160px] border-0 border-r rounded-none focus:ring-0 bg-muted/30 hover:bg-muted/50"
            aria-label="Filter by department"
          >
            <SelectValue
              placeholder={departmentsLoading ? "Loading..." : "All"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.code} value={dept.code}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input - Middle */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search courses, topics, or tutors..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
            autoComplete="off"
            maxLength={40}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              selectedIndex >= 0 ? getSuggestionId(selectedIndex) : undefined
            }
            aria-label="Search for tutors by course, topic, or name"
          />
        </div>

        {/* Search Button - Right Side */}
        <Button
          type="submit"
          className="rounded-none px-6 sm:px-8 border-0"
          size="default"
          aria-label="Submit search"
        >
          <Search className="h-4 w-4 sm:mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Screen reader announcement for search results */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {showDropdown &&
          !loading &&
          suggestions.length > 0 &&
          `${suggestions.length} suggestion${
            suggestions.length === 1 ? "" : "s"
          } available. Use arrow keys to navigate.`}
        {showDropdown &&
          !loading &&
          suggestions.length === 0 &&
          query.length >= 2 &&
          "No results found"}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50"
        >
          {loading ? (
            <div
              className="p-4 text-sm text-muted-foreground text-center"
              role="status"
            >
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.post_id || suggestion.id || index}
                  id={getSuggestionId(index)}
                  type="button"
                  role="option"
                  aria-selected={selectedIndex === index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3 ${
                    selectedIndex === index ? "bg-accent" : ""
                  }`}
                >
                  <Search
                    className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {suggestion.course_code && (
                        <span className="font-semibold text-foreground">
                          {suggestion.course_code}
                        </span>
                      )}
                      {suggestion.course_name && (
                        <span className="text-sm text-muted-foreground truncate">
                          {suggestion.course_name}
                        </span>
                      )}
                    </div>
                    {suggestion.title && (
                      <div className="text-sm text-foreground mt-1">
                        {suggestion.title}
                      </div>
                    )}
                    {suggestion.hourly_rate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ${suggestion.hourly_rate}/hr
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="p-4 text-sm text-muted-foreground text-center"
              role="status"
            >
              No results found
            </div>
          )}
        </div>
      )}
    </form>
  );
}
