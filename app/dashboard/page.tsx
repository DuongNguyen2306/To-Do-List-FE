'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axiosInstance';
import Navbar from '@/components/Navbar';
import TaskModal from '@/components/TaskModal';
import KanbanBoard from '@/components/KanbanBoard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState('');

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axiosInstance.get('/api/tasks');
      
      // Kiểm tra và đảm bảo response.data là array
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
    } else {
        console.warn('API response format unexpected:', response.data);
        setTasks([]);
      }
    } catch (error: any) {
      setError('Không thể tải danh sách task. Vui lòng thử lại.');
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: { 
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
      const response = await axiosInstance.post('/api/tasks', data);
      setTasks(prev => [response.data, ...prev]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo task');
    }
  };

  const handleUpdateTask = async (data: { 
    title: string; 
    description: string; 
    status?: string; 
    priority?: string; 
    project?: string; 
    tags?: string[]; 
    dueDate?: string; 
    reminderAt?: string; 
  }) => {
    if (!editingTask) return;
    
    try {
      const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, data);
      setTasks(prev => prev.map(task => 
        task._id === editingTask._id ? response.data : task
      ));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật task');
    }
  };

  const handleTaskStatusUpdate = async (id: string, status: string) => {
    try {
      const task = tasks.find(t => t._id === id);
      if (!task) {
        console.error('Task not found:', id);
        return;
      }

      console.log('Updating task:', { id, status, task });

      // Gửi đầy đủ thông tin task để đảm bảo API nhận được đúng format
      const updateData = {
        title: task.title,
        description: task.description || '',
        status: status,
        priority: task.priority || 'medium',
        project: task.project || '',
        tags: task.tags || [],
        dueDate: task.dueDate || '',
        reminderAt: task.reminderAt || ''
      };

      console.log('Sending update data:', updateData);

      const response = await axiosInstance.put(`/api/tasks/${id}`, updateData);
      
      console.log('Update response:', response.data);
      
      setTasks(prev => prev.map(t => 
        t._id === id ? response.data : t
      ));
    } catch (error: any) {
      console.error('Error updating task:', error);
      console.error('Error response:', error.response?.data);
      setError(`Không thể cập nhật trạng thái task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteTask = async (id: string, hardDelete = false) => {
    try {
      const url = hardDelete ? `/api/tasks/${id}/hard` : `/api/tasks/${id}`;
      await axiosInstance.delete(url);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (error: any) {
      setError('Không thể xóa task');
      console.error('Error deleting task:', error);
    }
  };

  const handleMoveToDate = async (id: string, date: Date) => {
    try {
      const task = tasks.find(t => t._id === id);
      if (!task) return;

      // Set the time to end of day for the selected date
      const targetDate = new Date(date);
      targetDate.setHours(23, 59, 59, 999);

      const updateData = {
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        project: task.project || '',
        tags: task.tags || [],
        dueDate: targetDate.toISOString(),
        reminderAt: task.reminderAt || ''
      };

      const response = await axiosInstance.put(`/api/tasks/${id}`, updateData);
      setTasks(prev => prev.map(t => 
        t._id === id ? response.data : t
      ));
    } catch (error: any) {
      setError('Không thể chuyển task sang ngày đã chọn');
      console.error('Error moving task to date:', error);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Task Dashboard
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                  Quản lý và theo dõi tiến độ công việc của bạn
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm">To do</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm">In progress</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm">On approval</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm">Done</span>
                </div>
              </div>
            </div>
          </div>
        
          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Kanban Board */}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <LoadingSpinner size="lg" text="Đang tải..." />
                <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
              <KanbanBoard
                tasks={tasks}
                onTaskUpdate={handleTaskStatusUpdate}
                onTaskEdit={openEditModal}
                onTaskDelete={handleDeleteTask}
                onTaskMoveToDate={handleMoveToDate}
                onCreateTask={() => setIsModalOpen(true)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Task Modal */}
          <TaskModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            task={editingTask}
            selectedDate={new Date()}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}