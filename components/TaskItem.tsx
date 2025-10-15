'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  Calendar,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project: string;
  tags: string[];
  dueDate: string;
  reminderAt: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string, hardDelete?: boolean) => void;
  isLoading?: boolean;
}

export default function TaskItem({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: TaskItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<'soft' | 'hard'>('soft');

  const handleDelete = (type: 'soft' | 'hard') => {
    setDeleteType(type);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(task._id, deleteType === 'hard');
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-md ${
        task.status === 'Done' ? 'opacity-75 bg-gray-50' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={task.status === 'Done'}
              onCheckedChange={(checked) => onToggleComplete(task._id, checked ? 'Done' : 'To do')}
              disabled={isLoading}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {task.status === 'Done' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <h3 className={`font-medium text-sm ${
                  task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.status === 'Done' && (
                  <Badge variant="secondary" className="text-xs">
                    Hoàn thành
                  </Badge>
                )}
                {task.priority && (
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
              
              {task.description && (
                <p className={`text-sm text-gray-600 mb-2 ${
                  task.status === 'Done' ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Tạo: {formatDate(task.createdAt)}</span>
                </div>
                {task.updatedAt !== task.createdAt && (
                  <div className="flex items-center space-x-1">
                    <span>Cập nhật: {formatDate(task.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete('soft')}
                  className="text-orange-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa tạm thời
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete('hard')}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa vĩnh viễn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === 'soft' ? 'Xóa tạm thời' : 'Xóa vĩnh viễn'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'soft' 
                ? 'Task sẽ được chuyển vào thùng rác và có thể khôi phục sau này.'
                : 'Task sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className={deleteType === 'hard' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {deleteType === 'soft' ? 'Xóa tạm thời' : 'Xóa vĩnh viễn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
