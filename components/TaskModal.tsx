'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, X, Plus } from 'lucide-react';

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

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    description: string; 
    status?: string; 
    priority?: string; 
    project?: string; 
    tags?: string[]; 
    dueDate?: string; 
    reminderAt?: string; 
  }) => Promise<void>;
  task?: Task | null;
  selectedDate?: Date;
  isLoading?: boolean;
}

const taskSchema = Yup.object({
  title: Yup.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(100, 'Tiêu đề không được quá 100 ký tự')
    .required('Tiêu đề là bắt buộc'),
  description: Yup.string()
    .max(500, 'Mô tả không được quá 500 ký tự'),
  status: Yup.string()
    .oneOf(['To do', 'In progress', 'On approval', 'Done'], 'Trạng thái không hợp lệ'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Độ ưu tiên không hợp lệ'),
  project: Yup.string()
    .max(50, 'Tên project không được quá 50 ký tự'),
  tags: Yup.array()
    .of(Yup.string())
    .max(5, 'Không được quá 5 tags'),
});

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task, 
  selectedDate = new Date(),
  isLoading = false 
}: TaskModalProps) {
  const isEdit = !!task;
  const [newTag, setNewTag] = React.useState('');

  const handleSubmit = async (values: { 
    title: string; 
    description: string; 
    status?: string; 
    priority?: string; 
    project?: string; 
    tags?: string[]; 
    dueDate?: string; 
    reminderAt?: string; 
  }) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa Task' : 'Thêm Task mới'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Cập nhật thông tin task của bạn.' 
              : 'Tạo một task mới để quản lý công việc.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Formik
          initialValues={{
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || 'To do',
            priority: task?.priority || 'medium',
            project: task?.project || '',
            tags: task?.tags || [],
            dueDate: task?.dueDate || (isEdit ? '' : selectedDate.toISOString()),
            reminderAt: task?.reminderAt || '',
          }}
          validationSchema={taskSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Nhập tiêu đề task"
                  className={errors.title && touched.title ? 'border-red-500' : ''}
                />
                {errors.title && touched.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả chi tiết (tùy chọn)"
                  rows={3}
                  className={errors.description && touched.description ? 'border-red-500' : ''}
                />
                {errors.description && touched.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Field name="status">
                    {({ field, form }: any) => (
                      <Select value={field.value} onValueChange={(value) => form.setFieldValue('status', value)}>
                        <SelectTrigger className={errors.status && touched.status ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To do">To do</SelectItem>
                          <SelectItem value="In progress">In progress</SelectItem>
                          <SelectItem value="On approval">On approval</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.status && touched.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Độ ưu tiên</Label>
                  <Field name="priority">
                    {({ field, form }: any) => (
                      <Select value={field.value} onValueChange={(value) => form.setFieldValue('priority', value)}>
                        <SelectTrigger className={errors.priority && touched.priority ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Chọn độ ưu tiên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.priority && touched.priority && (
                    <p className="text-sm text-red-500">{errors.priority}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Field
                  as={Input}
                  id="project"
                  name="project"
                  placeholder="Nhập tên project (tùy chọn)"
                  className={errors.project && touched.project ? 'border-red-500' : ''}
                />
                {errors.project && touched.project && (
                  <p className="text-sm text-red-500">{errors.project}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Field name="tags">
                  {({ field, form }: any) => (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = field.value.filter((_: any, i: number) => i !== index);
                                form.setFieldValue('tags', newTags);
                              }}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Thêm tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newTag.trim() && !field.value?.includes(newTag.trim())) {
                                const newTags = [...(field.value || []), newTag.trim()];
                                form.setFieldValue('tags', newTags);
                                setNewTag('');
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newTag.trim() && !field.value?.includes(newTag.trim())) {
                              const newTags = [...(field.value || []), newTag.trim()];
                              form.setFieldValue('tags', newTags);
                              setNewTag('');
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Field>
                {errors.tags && touched.tags && (
                  <p className="text-sm text-red-500">{errors.tags}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting || isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? 'Đang cập nhật...' : 'Đang tạo...'}
                    </>
                  ) : (
                    isEdit ? 'Cập nhật' : 'Tạo Task'
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
