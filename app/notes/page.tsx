'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import NotesList from '@/components/Notes/NotesList';
import NoteForm from '@/components/Notes/NoteForm';
import {
  notesAPI,
  Note,
  CreateNoteData,
  UpdateNoteData,
  NoteFilters,
} from '@/lib/notesAPI';
import { toast } from 'sonner';
import { StickyNote, Loader2 } from 'lucide-react';

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<NoteFilters>({
    page: 1,
    limit: 20,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load notes, categories, and tags on component mount and filter changes
  useEffect(() => {
    loadNotes();
    loadCategories();
    loadTags();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notesAPI.getAll(filters);
      setNotes(response.notes || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
      setTotalPages(response.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading notes:', error);
      toast.error('Không thể tải notes');
      setNotes([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await notesAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      // Silently fail - categories are optional
    }
  };

  const loadTags = async () => {
    try {
      const data = await notesAPI.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading tags:', error);
      // Silently fail - tags are optional
    }
  };

  const handleCreateNote = async (noteData: CreateNoteData) => {
    try {
      setIsSubmitting(true);
      const newNote = await notesAPI.create(noteData);
      toast.success('Tạo note thành công');
      setIsFormOpen(false);
      // Reload notes
      await loadNotes();
      // Reload categories and tags in case new ones were added
      await loadCategories();
      await loadTags();
    } catch (error: any) {
      console.error('Error creating note:', error);
      toast.error(error.response?.data?.message || 'Không thể tạo note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (noteData: UpdateNoteData) => {
    if (!editingNote) return;

    try {
      setIsSubmitting(true);
      await notesAPI.update(editingNote._id, noteData);
      toast.success('Cập nhật note thành công');
      setIsFormOpen(false);
      setEditingNote(null);
      // Reload notes
      await loadNotes();
      // Reload categories and tags in case new ones were added
      await loadCategories();
      await loadTags();
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa note này?')) return;

    try {
      await notesAPI.delete(noteId);
      toast.success('Xóa note thành công');
      // Reload notes
      await loadNotes();
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa note');
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      await notesAPI.togglePin(noteId);
      toast.success('Đã cập nhật trạng thái pin');
      // Reload notes
      await loadNotes();
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật pin');
    }
  };

  const handleToggleArchive = async (noteId: string) => {
    try {
      await notesAPI.toggleArchive(noteId);
      toast.success('Đã cập nhật trạng thái lưu trữ');
      // Reload notes
      await loadNotes();
    } catch (error: any) {
      console.error('Error toggling archive:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật lưu trữ');
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n._id === noteId);
    if (note) {
      setEditingNote(note);
      setIsFormOpen(true);
    }
  };

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleFormSubmit = (data: CreateNoteData | UpdateNoteData) => {
    if (editingNote) {
      handleUpdateNote(data as UpdateNoteData);
    } else {
      handleCreateNote(data as CreateNoteData);
    }
  };

  const handleFiltersChange = (newFilters: Partial<NoteFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  };

  // Calculate stats
  const stats = {
    total: total,
    pinned: notes.filter(n => n.isPinned && !n.isArchived).length,
    archived: notes.filter(n => n.isArchived).length,
    active: notes.filter(n => !n.isArchived).length,
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
                <StickyNote className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
                <p className="text-gray-600 mt-1">
                  Lưu trữ và quản lý các link và text quan trọng
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng notes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <StickyNote className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã pin</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.pinned}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã lưu trữ</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <NotesList
            notes={notes}
            total={total}
            page={page}
            limit={limit}
            totalPages={totalPages}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleArchive={handleToggleArchive}
            onCreateNew={handleCreateNew}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
            categories={categories}
            tags={tags}
            currentFilters={filters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Form Modal */}
          <NoteForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={editingNote}
            isLoading={isSubmitting}
            categories={categories}
            existingTags={tags}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

