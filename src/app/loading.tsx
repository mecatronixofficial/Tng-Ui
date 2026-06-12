import { FaBoxes, FaStore, FaTruckMoving } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-cream-50 px-5">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-primary-100 bg-white shadow-warm">
        <div className="bg-primary-900 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-secondary">
              <FaTruckMoving className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
                Loading cloth store
              </div>
              <div className="mt-1 text-lg font-extrabold">
                Preparing retail and wholesale items
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
              <FaStore className="h-4 w-4 text-primary-600" />
              <div className="mt-2 text-xs font-bold uppercase tracking-wide text-primary-800">
                Retail
              </div>
            </div>
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
              <FaBoxes className="h-4 w-4 text-secondary" />
              <div className="mt-2 text-xs font-bold uppercase tracking-wide text-primary-800">
                Wholesale
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-full bg-primary-100 shimmer" />
            <div className="h-3 w-full rounded-full bg-primary-100 shimmer" />
            <div className="h-3 w-2/3 rounded-full bg-primary-100 shimmer" />
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-x text-primary-800">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            Please wait
          </div>
        </div>
      </div>
    </div>
  );
}
