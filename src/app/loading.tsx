export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-50">
      {/* Spinner ring + icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <svg
          className="absolute h-24 w-24 animate-spin loading-spinner text-secondary"
          viewBox="0 0 96 96"
          fill="none"
        >
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60 200"
          />
        </svg>

        {/* Inner brand circle */}
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-900 shadow-warm">
          <span className="text-2xl font-extrabold text-secondary">T</span>
        </div>
      </div>

      {/* Brand name */}
      <div className="mt-6 text-center">
        <div className="text-lg font-extrabold tracking-tight text-primary-950">
          Thangavel Textile
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-1.5">
          <span className="loading-dot-1 h-1.5 w-1.5 rounded-full bg-secondary animate-bounce" />
          <span className="loading-dot-2 h-1.5 w-1.5 rounded-full bg-secondary animate-bounce" />
          <span className="loading-dot-3 h-1.5 w-1.5 rounded-full bg-secondary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
