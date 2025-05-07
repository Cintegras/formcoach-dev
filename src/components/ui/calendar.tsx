
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[#D7E4E3]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-[#1C1C1E] p-0 text-[#00C4B4] hover:bg-[#2C2C2E] hover:text-[#00C4B4] border-[#2C2C2E]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[#A4B1B7] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#1C1C1E]/50 [&:has([aria-selected])]:bg-[#1C1C1E] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-[rgba(209, 235, 233, 0.62)] aria-selected:opacity-100 hover:bg-[#2C2C2E]"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#00C4B4] text-[#020D0C] hover:bg-[#00C4B4] hover:text-[#020D0C] focus:bg-[#00C4B4] focus:text-[#020D0C]",
        day_today: "bg-[#2C2C2E] text-[rgba(209, 235, 233, 0.62)]",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-[#1C1C1E]/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-[#1C1C1E] aria-selected:text-[rgba(209, 235, 233, 0.62)]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
