import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils.ts";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-blue-50 text-blue-900 hover:bg-blue-100",
        variant === "ghost" && "hover:bg-blue-50",
        variant === "outline" && "border border-blue-200 bg-white hover:bg-blue-50",
        size === "sm" && "h-9 px-3",
        size === "default" && "h-10 px-4 py-2",
        size === "lg" && "h-12 px-6",
        className,
      )}
      {...props}
    />
  );
}
