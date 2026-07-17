import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-dark mb-4">404</h1>
        <h2 className="section-heading text-neutral-dark mb-4">
          Team Member Not Found
        </h2>
        <p className="body-text text-neutral-medium mb-8 max-w-md">
          Sorry, we couldn&apos;t find the team member you&apos;re looking for.
          They may have graduated or the link might be incorrect.
        </p>
        <Link href="/" className="btn-primary">
          <span>Back to Team</span>
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
        </Link>
      </div>
    </div>
  );
}
