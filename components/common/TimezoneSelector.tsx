'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Việt Nam (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Thái Lan (GMT+7)' },
  { value: 'Asia/Jakarta', label: 'Indonesia (GMT+7)' },
  { value: 'Asia/Manila', label: 'Philippines (GMT+8)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Malaysia (GMT+8)' },
  { value: 'Asia/Shanghai', label: 'Trung Quốc (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Nhật Bản (GMT+9)' },
  { value: 'Asia/Seoul', label: 'Hàn Quốc (GMT+9)' },
  { value: 'Australia/Sydney', label: 'Australia Sydney (GMT+10)' },
  { value: 'Pacific/Auckland', label: 'New Zealand (GMT+12)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
  { value: 'UTC', label: 'UTC (GMT+0)' }
];

export default function TimezoneSelector({ 
  value, 
  onChange, 
  label = "Múi giờ",
  required = false,
  disabled = false 
}: TimezoneSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone-selector" className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled} required={required}>
        <SelectTrigger id="timezone-selector" className="w-full">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Chọn múi giờ" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {TIMEZONES.map((timezone) => (
            <SelectItem key={timezone.value} value={timezone.value}>
              {timezone.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
