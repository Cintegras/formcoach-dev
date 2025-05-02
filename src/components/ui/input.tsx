
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#3A3A3C] bg-[#1C1C1E] px-4 py-3 text-base text-white ring-offset-background placeholder:text-[#8E8E93] focus-visible:outline-none focus-visible:border-[#00C4B4] focus-visible:ring-1 focus-visible:ring-[#00C4B4] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
