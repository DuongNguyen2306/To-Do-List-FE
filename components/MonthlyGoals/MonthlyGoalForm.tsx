'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TimePicker from '@/components/common/TimePicker';
import TimezoneSelector from '@/components/common/TimezoneSelector';
import WeekdaySelector from '@/components/common/WeekdaySelector';
import { CreateMonthlyGoalData, MonthlyGoal } from '@/lib/monthlyGoalsAPI';
import { Target, Calendar, Clock, Globe } from 'lucide-react';

interface MonthlyGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMonthlyGoalData) => void;
  initialData?: MonthlyGoal;
  isLoading?: boolean;
}

export default function MonthlyGoalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}: MonthlyGoalFormProps) {
  const [formData, setFormData] = useState<CreateMonthlyGoalData>({
    title: '',
    description: '',
    dailyTime: '06:00',
    timezone: 'Asia/Ho_Chi_Minh',
    repeatConfig: {
      weekdays: [1, 2, 3, 4, 5],
      includeWeekends: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        dailyTime: initialData.dailyTime,
        timezone: initialData.timezone,
        repeatConfig: {
          weekdays: initialData.repeatConfig.weekdays,
          includeWeekends: initialData.repeatConfig.includeWeekends
        }
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dailyTime: '06:00',
        timezone: 'Asia/Ho_Chi_Minh',
        repeatConfig: {
          weekdays: [1, 2, 3, 4, 5],
          includeWeekends: false
        }
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tên mục tiêu là bắt buộc';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Tên mục tiêu không được vượt quá 255 ký tự';
    }

    if (!formData.dailyTime) {
      newErrors.dailyTime = 'Thời gian hàng ngày là bắt buộc';
    }

    if (!formData.timezone) {
      newErrors.timezone = 'Múi giờ là bắt buộc';
    }

    if (!formData.repeatConfig.weekdays.length) {
      newErrors.weekdays = 'Vui lòng chọn ít nhất một ngày trong tuần';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      dailyTime: '06:00',
      timezone: 'Asia/Ho_Chi_Minh',
      repeatConfig: {
        weekdays: [1, 2, 3, 4, 5],
        includeWeekends: false
      }
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {initialData ? 'Chỉnh sửa mục tiêu' : 'Tạo mục tiêu mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Tên mục tiêu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Tập gym mỗi ngày"
                  maxLength={255}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về mục tiêu..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Thời gian và lịch trình
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Daily Time */}
              <TimePicker
                value={formData.dailyTime}
                onChange={(time) => setFormData({ ...formData, dailyTime: time })}
                label="Thời gian hàng ngày"
                required
              />
              {errors.dailyTime && (
                <p className="text-sm text-red-500">{errors.dailyTime}</p>
              )}

              {/* Timezone */}
              <TimezoneSelector
                value={formData.timezone}
                onChange={(timezone) => setFormData({ ...formData, timezone })}
                label="Múi giờ"
                required
              />
              {errors.timezone && (
                <p className="text-sm text-red-500">{errors.timezone}</p>
              )}

              {/* Weekdays */}
              <WeekdaySelector
                value={formData.repeatConfig.weekdays}
                onChange={(weekdays) => setFormData({
                  ...formData,
                  repeatConfig: { ...formData.repeatConfig, weekdays }
                })}
                label="Ngày lặp lại"
              />
              {errors.weekdays && (
                <p className="text-sm text-red-500">{errors.weekdays}</p>
              )}

              {/* Include Weekends */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeWeekends"
                  checked={formData.repeatConfig.includeWeekends}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    repeatConfig: { ...formData.repeatConfig, includeWeekends: checked as boolean }
                  })}
                />
                <Label htmlFor="includeWeekends" className="text-sm">
                  Bao gồm cuối tuần
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Tạo mục tiêu')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
