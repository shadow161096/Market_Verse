import { ProductGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading UI — shown by Next.js App Router while the page component suspends.
 * Each route segment can have its own loading.tsx.
 */
export default function Loading() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Page title skeleton */}
                <div className="mb-8 flex flex-col gap-2">
                    <div className="skeleton w-64 h-9 rounded-xl" />
                    <div className="skeleton w-40 h-5 rounded-lg" />
                </div>
                <ProductGridSkeleton count={8} />
            </div>
        </div>
    );
}
