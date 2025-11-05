'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Calendar,
  Target
} from 'lucide-react';
import { MonthlyGoal } from '@/lib/monthlyGoalsAPI';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MonthlyGoalCardProps {
  goal: MonthlyGoal;
  onView: (goalId: string) => void;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onStatusChange: (goalId: string, status: string) => void;
}

export default function MonthlyGoalCard({
  goal,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}: MonthlyGoalCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: Play,
        text: 'Đang hoạt động'
      },
      paused: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Pause,
        text: 'Tạm dừng'
      },
      completed: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        text: 'Hoàn thành'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Trash2,
        text: 'Đã hủy'
      }
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const getWeekdayText = (weekdays: number[]) => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return weekdays.map(day => dayNames[day]).join(', ');
  };

  const statusConfig = getStatusConfig(goal.status);
  const StatusIcon = statusConfig.icon;
  const completionRate = goal.stats?.completionRate || 0;

  const handleStatusToggle = () => {
    if (goal.status === 'active') {
      onStatusChange(goal._id, 'paused');
    } else if (goal.status === 'paused') {
      onStatusChange(goal._id, 'active');
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(goal._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {goal.title}
              </h3>
              {goal.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {goal.description}
                </p>
              )}
            </div>
            <Badge className={`${statusConfig.color} flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.text}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Goal Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{goal.dailyTime}</span>
              <span className="mx-2">•</span>
              <span>{goal.timezone}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{getWeekdayText(goal.repeatConfig?.weekdays || [])}</span>
              {goal.repeatConfig?.includeWeekends && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  + Cuối tuần
                </span>
              )}
            </div>
          </div>

          {/* Progress */}
          {goal.stats && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tiến độ</span>
                <span className="font-medium">
                  {goal.stats.completedDays}/{goal.stats.totalDays} ngày
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="text-right text-sm text-gray-500">
                {completionRate.toFixed(1)}% hoàn thành
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => onView(goal._id)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              Xem chi tiết
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(goal._id)}>
                  <Eye className="mr-2 h-3 w-3" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(goal._id)}>
                  <Edit className="mr-2 h-3 w-3" />
                  Chỉnh sửa
                </DropdownMenuItem>
                {(goal.status === 'active' || goal.status === 'paused') && (
                  <DropdownMenuItem onClick={handleStatusToggle}>
                    {goal.status === 'active' ? (
                      <>
                        <Pause className="mr-2 h-3 w-3" />
                        Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-3 w-3" />
                        Tiếp tục
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa mục tiêu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mục tiêu "{goal.title}"? 
              Hành động này không thể hoàn tác và sẽ xóa tất cả tasks liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
