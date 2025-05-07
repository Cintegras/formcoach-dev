
import React, { useState } from 'react';
import {Calendar as CalendarIcon} from 'lucide-react';
import {format} from 'date-fns';
import {Calendar} from '@/components/ui/calendar';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BirthdateStepProps {
    birthdate: Date | undefined;
    onChange: (value: Date) => void;
    error?: string;
}

const BirthdateStep: React.FC<BirthdateStepProps> = ({birthdate, onChange, error}) => {
    // Calculate min and max dates (18-90 years old)
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 90);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);

    // Create arrays for years and months for the dropdowns
    const years = Array.from({ length: 73 }, (_, i) => today.getFullYear() - 18 - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // State to store current view date (used for calendar navigation)
    const [currentMonth, setCurrentMonth] = useState<Date>(birthdate || maxDate);

    // Handle year change
    const handleYearChange = (year: string) => {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(parseInt(year));
        setCurrentMonth(newDate);
    };

    // Handle month change
    const handleMonthChange = (month: string) => {
        const monthIndex = months.findIndex(m => m === month);
        if (monthIndex !== -1) {
            const newDate = new Date(currentMonth);
            newDate.setMonth(monthIndex);
            setCurrentMonth(newDate);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center mb-2">
                <CalendarIcon size={28} className="text-[#00C4B4] mr-3"/>
                <h1 className="text-2xl font-bold text-center text-white">
                    What's your birthdate?
                </h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[270px] justify-center text-left font-normal",
                                !birthdate ? "text-[#A4B1B7] bg-[#1C1C1E] border-[#2C2C2E]" : 
                                "text-white bg-[#1C1C1E] border-[#00C4B4]"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-5 w-5 text-[#00C4B4]"/>
                            {birthdate ? format(birthdate, 'MMMM d, yyyy') : <span>Select your birthdate</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0 border-[#2C2C2E] bg-[#121212]" 
                      align="center"
                    >
                        {/* Year and Month selectors */}
                        <div className="flex justify-between p-3 border-b border-[#2C2C2E]">
                            <Select
                                value={currentMonth.getFullYear().toString()}
                                onValueChange={handleYearChange}
                            >
                                <SelectTrigger className="w-[110px] bg-[#1C1C1E] border-[#2C2C2E] text-white">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1E] border-[#2C2C2E] text-white">
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()} className="hover:bg-[#2C2C2E] focus:bg-[#2C2C2E] focus:text-white">
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={months[currentMonth.getMonth()]}
                                onValueChange={handleMonthChange}
                            >
                                <SelectTrigger className="w-[110px] bg-[#1C1C1E] border-[#2C2C2E] text-white">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1E] border-[#2C2C2E] text-white">
                                    {months.map((month) => (
                                        <SelectItem key={month} value={month} className="hover:bg-[#2C2C2E] focus:bg-[#2C2C2E] focus:text-white">
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Calendar with updated month/year based on selections */}
                        <div className="bg-[#121212]">
                            <Calendar
                                mode="single"
                                selected={birthdate}
                                onSelect={(date) => date && onChange(date)}
                                disabled={(date) => date > maxDate || date < minDate}
                                defaultMonth={currentMonth}
                                month={currentMonth}
                                onMonthChange={setCurrentMonth}
                                initialFocus
                                className="bg-[#121212]"
                            />
                        </div>
                    </PopoverContent>
                </Popover>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                {birthdate && (
                    <div className="text-lg font-medium text-[#00C4B4] mt-4">
                        {format(birthdate, 'MMMM d, yyyy')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BirthdateStep;
