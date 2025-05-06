import React from 'react';
import {Calendar as CalendarIcon} from 'lucide-react';
import {format} from 'date-fns';
import {Calendar} from '@/components/ui/calendar';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

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

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center mb-2">
                <CalendarIcon size={24} className="text-[#00C4B4] mr-2"/>
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
                                "w-[240px] justify-center text-left font-normal",
                                !birthdate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {birthdate ? format(birthdate, 'PPP') : <span>Select your birthdate</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                            mode="single"
                            selected={birthdate}
                            onSelect={(date) => date && onChange(date)}
                            disabled={(date) => date > maxDate || date < minDate}
                            initialFocus
                        />
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