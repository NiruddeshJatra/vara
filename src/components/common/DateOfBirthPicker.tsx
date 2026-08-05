import { useTranslation } from 'react-i18next';
import { formatDateLong } from '@/utils/formatDate';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateOfBirthPickerProps {
  value: string;
  onChange: (date: string) => void;
  error?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export function DateOfBirthPicker({
  value,
  onChange,
  error = false,
  className,
  label,
  required = false,
}: DateOfBirthPickerProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('completeProfile.dateOfBirth');
  const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);
  const [year, setYear] = useState<number | null>(date ? date.getFullYear() : null);
  const [month, setMonth] = useState<number | null>(date ? date.getMonth() : null);
  const [day, setDay] = useState<number | null>(date ? date.getDate() : null);

  // Generate years (from 100 years ago to 18 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 83 }, (_, i) => currentYear - 18 - i);

  // Months
  const months = [
    { value: 0, label: t('months.january') },
    { value: 1, label: t('months.february') },
    { value: 2, label: t('months.march') },
    { value: 3, label: t('months.april') },
    { value: 4, label: t('months.may') },
    { value: 5, label: t('months.june') },
    { value: 6, label: t('months.july') },
    { value: 7, label: t('months.august') },
    { value: 8, label: t('months.september') },
    { value: 9, label: t('months.october') },
    { value: 10, label: t('months.november') },
    { value: 11, label: t('months.december') },
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = month !== null && year !== null
    ? Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1)
    : [];

  // Update the date when year, month, or day changes
  useEffect(() => {
    if (year !== null && month !== null && day !== null) {
      const newDate = new Date(year, month, day);
      setDate(newDate);
      onChange(newDate.toISOString().split('T')[0]);
    }
  }, [year, month, day, onChange]);

  // Format the display value
  const displayValue = date ? formatDateLong(date) : '';

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {resolvedLabel} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {displayValue || t('profilePage.selectDob')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <div className="flex flex-row gap-2 items-end">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Year</label>
                  <Select
                    value={year?.toString()}
                    onValueChange={(value) => setYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder={t('profilePage.year')} />
                    </SelectTrigger>
                    <SelectContent className="text-xs sm:text-md">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Month</label>
                  <Select
                    value={month?.toString()}
                    onValueChange={(value) => setMonth(parseInt(value))}
                    disabled={year === null}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={t('profilePage.month')} />
                    </SelectTrigger>
                    <SelectContent className="text-xs sm:text-md">
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Day</label>
                  <Select
                    value={day?.toString()}
                    onValueChange={(value) => setDay(parseInt(value))}
                    disabled={month === null}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={t('profilePage.day')} />
                    </SelectTrigger>
                    <SelectContent className="text-xs sm:text-md">
                      {days.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">Please select a valid date of birth</p>
      )}
    </div>
  );
} 