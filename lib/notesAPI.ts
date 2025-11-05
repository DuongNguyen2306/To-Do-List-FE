import axiosInstance from './axiosInstance';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  links?: Array<{
    url: string;
    title?: string;
    description?: string;
  }>;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tags?: string[];
  category?: string;
  color?: string;
  isPinned?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface NoteFilters {
  category?: string;
  search?: string;
  tag?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface NotesListResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const notesAPI = {
  // Tạo note mới
  create: async (data: CreateNoteData): Promise<Note> => {
    const response = await axiosInstance.post('/api/notes', data);
    return response.data;
  },

  // Lấy danh sách notes với filters
  getAll: async (filters: NoteFilters = {}): Promise<NotesListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await axiosInstance.get(`/api/notes?${params}`);
    return response.data;
  },

  // Lấy chi tiết note
  getOne: async (id: string): Promise<{ note: Note; links: any[] }> => {
    const response = await axiosInstance.get(`/api/notes/${id}`);
    return response.data;
  },

  // Cập nhật note
  update: async (id: string, data: UpdateNoteData): Promise<Note> => {
    const response = await axiosInstance.put(`/api/notes/${id}`, data);
    return response.data;
  },

  // Xóa note
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/notes/${id}`);
  },

  // Toggle pin
  togglePin: async (id: string): Promise<Note> => {
    const response = await axiosInstance.post(`/api/notes/${id}/pin`);
    return response.data;
  },

  // Toggle archive
  toggleArchive: async (id: string): Promise<Note> => {
    const response = await axiosInstance.post(`/api/notes/${id}/archive`);
    return response.data;
  },

  // Lấy danh sách categories
  getCategories: async (): Promise<string[]> => {
    const response = await axiosInstance.get('/api/notes/categories/list');
    return response.data.categories || response.data || [];
  },

  // Lấy danh sách tags
  getTags: async (): Promise<string[]> => {
    const response = await axiosInstance.get('/api/notes/tags/list');
    return response.data.tags || response.data || [];
  },
};

