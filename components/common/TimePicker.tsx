'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function TimePicker({ 
  value, 
  onChange, 
  label = "Thời gian",
  required = false,
  disabled = false 
}: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="time-picker" className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="time-picker"
          type="time"
          value={value}
          onChange={handleTimeChange}
          disabled={disabled}
          className="pl-10"
          required={required}
        />
      </div>
    </div>
  );
}
