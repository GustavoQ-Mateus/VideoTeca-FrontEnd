import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Efeito de elevação no hover (use apenas em cards clicáveis). */
  hover?: boolean;
  /** Espaçamento interno padrão (sem precisar de CardBody). */
  padded?: boolean;
}

export function Card({ className, hover, padded, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-line",
        padded && "p-4 sm:p-6",
        hover &&
          "transition-[box-shadow,transform] duration-200 motion-reduce:transition-none hover:shadow-[0_8px_24px_rgba(0,102,179,0.12)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 cursor-pointer focus-within:shadow-[0_8px_24px_rgba(0,102,179,0.12)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-line", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-title-sm font-semibold text-fg font-display", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-4 sm:px-6 py-4 border-t border-line flex flex-wrap items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
