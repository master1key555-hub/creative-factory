import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
type Size = "default" | "sm" | "lg" | "icon";

const variants: Record<Variant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  outline:
    "border border-border bg-transparent hover:bg-muted text-foreground",
  ghost:
    "hover:bg-muted text-foreground",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link:
    "text-primary underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-8 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
