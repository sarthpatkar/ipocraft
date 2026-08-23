"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

/**
 * Renders an animated number counter.
 * Receives the final `value` as a prop from a Server Component.
 * The animation runs purely on the client after hydration.
 */
export default function AnimatedCount({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const animated = useCountUp(value, 900);
  return (
    <span className={className}>
      {animated.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
