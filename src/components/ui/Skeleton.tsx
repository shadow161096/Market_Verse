"use client";

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
    className?: string;
    rounded?: string;
}

export function Skeleton({ className, rounded = "rounded-lg" }: SkeletonProps) {
    return <div className={cn("skeleton", rounded, className)} />;
}

export function ProductCardSkeleton() {
    return (
        <div className="glass rounded-2xl overflow-hidden p-4 flex flex-col gap-4">
            <Skeleton className="w-full aspect-square" rounded="rounded-xl" />
            <div className="flex flex-col gap-2">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-1/3 h-6" />
            </div>
            <Skeleton className="w-full h-10" rounded="rounded-xl" />
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
