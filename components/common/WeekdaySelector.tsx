'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';

interface WeekdaySelectorProps {
  value: number[];
  onChange: (weekdays: number[]) => void;
  label?: string;
  disabled?: boolean;
}

const WEEKDAYS = [
  { value: 0, label: 'Chủ nhật', short: 'CN' },
  { value: 1, label: 'Thứ 2', short: 'T2' },
  { value: 2, label: 'Thứ 3', short: 'T3' },
  { value: 3, label: 'Thứ 4', short: 'T4' },
  { value: 4, label: 'Thứ 5', short: 'T5' },
  { value: 5, label: 'Thứ 6', short: 'T6' },
  { value: 6, label: 'Thứ 7', short: 'T7' }
];

export default function WeekdaySelector({ 
  value, 
  onChange, 
  label = "Ngày trong tuần",
  disabled = false 
}: WeekdaySelectorProps) {
  const handleWeekdayChange = (weekday: number, checked: boolean) => {
    if (checked) {
      onChange([...value, weekday]);
    } else {
      onChange(value.filter(day => day !== weekday));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onChange([0, 1, 2, 3, 4, 5, 6]);
    } else {
      onChange([]);
    }
  };

  const isAllSelected = value.length === 7;
  const isWeekdaysSelected = value.length === 5 && value.every(day => day >= 1 && day <= 5);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
        {label}
      </Label>
      
      <div className="space-y-2">
        {/* Quick select buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSelectAll(!isAllSelected)}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              isAllSelected 
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
            disabled={disabled}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              isWeekdaysSelected 
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
            disabled={disabled}
          >
            Thứ 2-6
          </button>
          <button
            type="button"
            onClick={() => onChange([0, 6])}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              value.length === 2 && value.includes(0) && value.includes(6)
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
            disabled={disabled}
          >
            Cuối tuần
          </button>
        </div>

        {/* Individual weekday checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday.value} className="flex items-center space-x-2">
              <Checkbox
                id={`weekday-${weekday.value}`}
                checked={value.includes(weekday.value)}
                onCheckedChange={(checked) => handleWeekdayChange(weekday.value, checked as boolean)}
                disabled={disabled}
              />
              <Label 
                htmlFor={`weekday-${weekday.value}`} 
                className="text-sm cursor-pointer flex-1"
              >
                <span className="hidden sm:inline">{weekday.label}</span>
                <span className="sm:hidden">{weekday.short}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
