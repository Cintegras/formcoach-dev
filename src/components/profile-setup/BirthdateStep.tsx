import React, {useState} from 'react';
import {Calendar as CalendarIcon} from 'lucide-react';
import {format} from 'date-fns';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Button} from '@/components/ui/button';

interface BirthdateStepProps {
    birthdate: Date | undefined;
    onChange: (value: Date) => void;
    error?: string;
}

const BirthdateStep: React.FC<BirthdateStepProps> = ({birthdate, onChange, error}) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 90);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);

    const years = Array.from({length: 73}, (_, i) => today.getFullYear() - 18 - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [currentMonth, setCurrentMonth] = useState<Date>(birthdate || maxDate);

    const handleYearChange = (year: string) => {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(parseInt(year));
        setCurrentMonth(newDate);
    };

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
                <h1 className="text-2xl font-bold text-center text-[#D7E4E3]">
                    What's your birthdate?
                </h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-8 mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[270px] justify-center text-left font-normal text-[#D7E4E3] bg-[#1C1C1E] border border-[#2C2C2E]"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-5 w-5 text-[#00C4B4]"/>
                            {birthdate ? format(birthdate, 'MMMM d, yyyy') : <span>Select your birthdate</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 border-[#2C2C2E] bg-[#1C1C1E] text-[#D7E4E3]"
                        align="center"
                    >
                        <div className="flex justify-between p-3 border-b border-[#2C2C2E]">
                            <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-[110px] bg-[#1C1C1E] border-[#2C2C2E] text-[#D7E4E3]">
                                    <SelectValue placeholder="Year"/>
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1E] border-[#2C2C2E] text-[#D7E4E3]">
                                    {years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                            className="hover:bg-[#2D2D2F] focus:bg-[#2D2D2F] focus:text-white"
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={months[currentMonth.getMonth()]} onValueChange={handleMonthChange}>
                                <SelectTrigger className="w-[110px] bg-[#1C1C1E] border-[#2C2C2E] text-[#D7E4E3]">
                                    <SelectValue placeholder="Month"/>
                                </SelectTrigger>
                                <SelectContent className="bg-[#1C1C1E] border-[#2C2C2E] text-[#D7E4E3]">
                                    {months.map((month) => (
                                        <SelectItem
                                            key={month}
                                            value={month}
                                            className="hover:bg-[#2D2D2F] focus:bg-[#2D2D2F] focus:text-white"
                                        >
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-[#1C1C1E]">
                            <Calendar
                                mode="single"
                                selected={birthdate}
                                onSelect={(date) => date && onChange(date)}
                                disabled={(date) => date > maxDate || date < minDate}
                                defaultMonth={currentMonth}
                                month={currentMonth}
                                onMonthChange={setCurrentMonth}
                                initialFocus
                                className="bg-[#1C1C1E] text-white"
                            />
                        </div>
                    </PopoverContent>
                </Popover>

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default BirthdateStep;