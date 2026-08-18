import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "primary", size = "md", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
					{
						"bg-primary text-white hover:bg-primary/90": variant === "primary",
						"bg-surface-variant text-on-surface hover:bg-surface-variant/80":
							variant === "secondary",
						"border border-outline-variant hover:bg-surface-variant":
							variant === "outline",
						"hover:bg-surface-variant": variant === "ghost",
						"bg-semantic-crimson text-white hover:bg-semantic-crimson/90":
							variant === "danger",
						"h-9 px-3 text-sm": size === "sm",
						"h-10 px-4 py-2": size === "md",
						"h-11 px-8": size === "lg",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";
