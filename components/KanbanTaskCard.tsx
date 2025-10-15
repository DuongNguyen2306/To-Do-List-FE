'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  User,
  Tag,
  ArrowRight
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

interface KanbanTaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: (hardDelete?: boolean) => void;
  onMoveToNextDay: () => void;
  isDragging?: boolean;
}

export function KanbanTaskCard({ task, onEdit, onDelete, onMoveToNextDay, isDragging = false }: KanbanTaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<'soft' | 'hard'>('soft');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task._id,
    data: {
      type: 'task',
      task: task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (type: 'soft' | 'hard') => {
    setDeleteType(type);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(deleteType === 'hard');
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy', { locale: vi });
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
          isDragging || isSortableDragging ? 'opacity-50 scale-105 shadow-lg' : ''
        }`}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Task Title */}
            <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
              {task.title}
            </h3>

            {/* Project & Priority */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {task.project}
              </Badge>
              {task.priority && (
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}

            {/* Footer with Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center text-xs text-gray-500">
                <User className="w-3 h-3 mr-1" />
                <span className="font-medium">JD</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-3 w-3" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onMoveToNextDay}>
                    <ArrowRight className="mr-2 h-3 w-3" />
                    Chuyển sang ngày mai
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete('soft')}
                    className="text-orange-600"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Xóa tạm thời
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete('hard')}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Xóa vĩnh viễn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
