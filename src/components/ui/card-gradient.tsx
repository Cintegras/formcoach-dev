
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardGradient = React.forwardRef<
  HTMLDivElement,
  CardGradientProps
>(({ children, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 shadow-xl",
      className
    )}
    {...props}
  >
    {children}
  </Card>
));
CardGradient.displayName = "CardGradient";

// Export all the components from the regular Card too
export {
  CardGradient,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
