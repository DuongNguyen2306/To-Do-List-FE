'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import MonthlyGoalsList from '@/components/MonthlyGoals/MonthlyGoalsList';
import MonthlyGoalForm from '@/components/MonthlyGoals/MonthlyGoalForm';
import { monthlyGoalsAPI, MonthlyGoal, CreateMonthlyGoalData, UpdateMonthlyGoalData } from '@/lib/monthlyGoalsAPI';
import { toast } from 'sonner';
import { Target, Loader2 } from 'lucide-react';

export default function MonthlyGoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to ensure goals is always an array
  const getSafeGoals = (): MonthlyGoal[] => {
    return Array.isArray(goals) ? goals : [];
  };

  // Load goals on component mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      console.log('Loading monthly goals...');
      const data = await monthlyGoalsAPI.getGoals();
      console.log('API response:', data);
      // Ensure data is an array
      setGoals(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading goals:', error);
      console.log('API not available, using mock data for demo');
      
      // Mock data for demo purposes
      const mockGoals: MonthlyGoal[] = [
        {
          _id: 'demo-1',
          title: 'Tập gym mỗi ngày',
          description: 'Tập gym để giữ sức khỏe và tăng cường thể lực',
          dailyTime: '06:00',
          timezone: 'Asia/Ho_Chi_Minh',
          repeatConfig: {
            weekdays: [1, 2, 3, 4, 5],
            includeWeekends: false
          },
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            totalDays: 30,
            completedDays: 15,
            completionRate: 50
          }
        }
      ];
      
      setGoals(mockGoals);
      toast.info('Đang sử dụng dữ liệu mẫu (API chưa sẵn sàng)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (goalData: CreateMonthlyGoalData) => {
    try {
      setIsSubmitting(true);
      const newGoal = await monthlyGoalsAPI.createGoal(goalData);
      setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
      setIsFormOpen(false);
      toast.success('Tạo mục tiêu thành công');
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast.error('Không thể tạo mục tiêu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGoal = async (goalData: UpdateMonthlyGoalData) => {
    if (!editingGoal) return;

    try {
      setIsSubmitting(true);
      const updatedGoal = await monthlyGoalsAPI.updateGoal(editingGoal._id, goalData);
      setGoals(prev => Array.isArray(prev) ? prev.map(goal => 
        goal._id === editingGoal._id ? updatedGoal : goal
      ) : []);
      setIsFormOpen(false);
      setEditingGoal(null);
      toast.success('Cập nhật mục tiêu thành công');
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error('Không thể cập nhật mục tiêu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await monthlyGoalsAPI.deleteGoal(goalId);
      setGoals(prev => Array.isArray(prev) ? prev.filter(goal => goal._id !== goalId) : []);
      toast.success('Xóa mục tiêu thành công');
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error('Không thể xóa mục tiêu');
    }
  };

  const handleStatusChange = async (goalId: string, status: string) => {
    try {
      const updatedGoal = await monthlyGoalsAPI.updateGoal(goalId, { status: status as any });
      setGoals(prev => Array.isArray(prev) ? prev.map(goal => 
        goal._id === goalId ? updatedGoal : goal
      ) : []);
      toast.success('Cập nhật trạng thái thành công');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleViewGoal = (goalId: string) => {
    // TODO: Navigate to goal details page
    console.log('View goal:', goalId);
  };

  const handleEditGoal = (goalId: string) => {
    const goal = Array.isArray(goals) ? goals.find(g => g._id === goalId) : undefined;
    if (goal) {
      setEditingGoal(goal);
      setIsFormOpen(true);
    }
  };

  const handleCreateNew = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const handleFormSubmit = (data: CreateMonthlyGoalData) => {
    if (editingGoal) {
      handleUpdateGoal(data);
    } else {
      handleCreateGoal(data);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mục tiêu hàng tháng</h1>
                <p className="text-gray-600 mt-1">
                  Tạo và theo dõi các mục tiêu lặp lại hàng tháng
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng mục tiêu</p>
                    <p className="text-2xl font-bold text-gray-900">{getSafeGoals().length}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-green-600">
                      {getSafeGoals().filter(g => g.status === 'active').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hoàn thành</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {getSafeGoals().filter(g => g.status === 'completed').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tạm dừng</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {getSafeGoals().filter(g => g.status === 'paused').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Đang tải mục tiêu...</p>
              </div>
            </div>
          ) : (
            <MonthlyGoalsList
              goals={getSafeGoals()}
              onView={handleViewGoal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onStatusChange={handleStatusChange}
              onCreateNew={handleCreateNew}
              isLoading={isLoading}
            />
          )}

          {/* Form Modal */}
          <MonthlyGoalForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={editingGoal}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
