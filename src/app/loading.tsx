export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <svg
        className="h-9 w-9 animate-spin text-primary-500"
        viewBox="0 0 96 96"
        fill="none"
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="60 200"
        />
      </svg>

      <div className="mt-5 text-sm font-bold tracking-tight text-primary-900">
        Thangavel Textile
      </div>
    </div>
  );
}