import axiosInstance from './axiosInstance';

export interface MonthlyGoal {
  _id: string;
  title: string;
  description: string;
  dailyTime: string;
  timezone: string;
  repeatConfig: {
    weekdays: number[];
    includeWeekends: boolean;
  };
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalDays: number;
    completedDays: number;
    completionRate: number;
  };
}

export interface CreateMonthlyGoalData {
  title: string;
  description?: string;
  dailyTime: string;
  timezone: string;
  repeatConfig: {
    weekdays: number[];
    includeWeekends: boolean;
  };
}

export interface UpdateMonthlyGoalData {
  title?: string;
  description?: string;
  dailyTime?: string;
  timezone?: string;
  repeatConfig?: {
    weekdays: number[];
    includeWeekends: boolean;
  };
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface MonthlyGoalFilters {
  status?: string;
  month?: number;
  year?: number;
}

export interface ProgressReport {
  totalGoals: number;
  activeGoals: number;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  topGoals: Array<{
    goalId: string;
    title: string;
    completionRate: number;
  }>;
}

export const monthlyGoalsAPI = {
  // Tạo mục tiêu hàng tháng
  createGoal: async (goalData: CreateMonthlyGoalData): Promise<MonthlyGoal> => {
    const response = await axiosInstance.post('/api/monthly-goals', goalData);
    return response.data;
  },

  // Lấy danh sách mục tiêu
  getGoals: async (filters: MonthlyGoalFilters = {}): Promise<MonthlyGoal[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await axiosInstance.get(`/api/monthly-goals?${queryParams}`);
    return response.data;
  },

  // Lấy chi tiết mục tiêu
  getGoalDetails: async (goalId: string): Promise<{
    goal: MonthlyGoal;
    tasks: any[];
    progress: any;
  }> => {
    const response = await axiosInstance.get(`/api/monthly-goals/${goalId}`);
    return response.data;
  },

  // Cập nhật mục tiêu
  updateGoal: async (goalId: string, goalData: UpdateMonthlyGoalData): Promise<MonthlyGoal> => {
    const response = await axiosInstance.put(`/api/monthly-goals/${goalId}`, goalData);
    return response.data;
  },

  // Xóa mục tiêu
  deleteGoal: async (goalId: string): Promise<void> => {
    await axiosInstance.delete(`/api/monthly-goals/${goalId}`);
  },

  // Lấy báo cáo tiến độ
  getProgressReport: async (month?: number, year?: number): Promise<ProgressReport> => {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month.toString());
    if (year) queryParams.append('year', year.toString());
    
    const response = await axiosInstance.get(`/api/monthly-goals/progress/report?${queryParams}`);
    return response.data;
  }
};
