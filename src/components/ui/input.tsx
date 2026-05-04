import * as React from "react";
import { cn } from "@/lib/utils.ts";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-blue-950 outline-none transition placeholder:text-blue-900/45 focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
        className,
      )}
      {...props}
    />
  );
}
