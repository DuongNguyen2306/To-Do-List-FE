'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import NoteCard from './NoteCard';
import { Note } from '@/lib/notesAPI';
import {
  Search,
  Filter,
  Plus,
  StickyNote,
  Grid3x3,
  List,
  Pin,
  Archive,
} from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onView?: (noteId: string) => void;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
  onCreateNew: () => void;
  onFiltersChange: (filters: {
    search?: string;
    category?: string;
    tag?: string;
    isPinned?: boolean | null;
    isArchived?: boolean;
    page?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  }) => void;
  isLoading?: boolean;
  categories?: string[];
  tags?: string[];
  currentFilters?: {
    search?: string;
    category?: string;
    tag?: string;
    isPinned?: boolean | null;
    isArchived?: boolean;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  };
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function NotesList({
  notes,
  total,
  page,
  limit,
  totalPages,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onCreateNew,
  onFiltersChange,
  isLoading = false,
  categories = [],
  tags = [],
  currentFilters = {},
  viewMode = 'grid',
  onViewModeChange,
}: NotesListProps) {
  const [localSearch, setLocalSearch] = useState(currentFilters.search || '');
  const [viewModeLocal, setViewModeLocal] = useState<'grid' | 'list'>(viewMode);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFiltersChange({ ...currentFilters, search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...currentFilters, category: value || undefined, page: 1 });
  };

  const handleTagChange = (value: string) => {
    onFiltersChange({ ...currentFilters, tag: value || undefined, page: 1 });
  };

  const handlePinnedChange = (value: string) => {
    const isPinned = value === 'pinned' ? true : value === 'unpinned' ? false : null;
    onFiltersChange({ ...currentFilters, isPinned, page: 1 });
  };

  const handleArchivedChange = (checked: boolean) => {
    onFiltersChange({ ...currentFilters, isArchived: checked, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    onFiltersChange({
      ...currentFilters,
      sortBy: sortBy as 'createdAt' | 'updatedAt' | 'title',
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    });
  };

  const handleViewModeChangeLocal = (mode: 'grid' | 'list') => {
    setViewModeLocal(mode);
    onViewModeChange?.(mode);
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...currentFilters, page: newPage });
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter(note => note.isPinned && !note.isArchived);
  const unpinnedNotes = notes.filter(note => !note.isPinned && !note.isArchived);
  const archivedNotes = notes.filter(note => note.isArchived);

  const displayNotes = currentFilters.isArchived ? archivedNotes : [...pinnedNotes, ...unpinnedNotes];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and View Mode */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm notes..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <ToggleGroup
                  type="single"
                  value={viewModeLocal}
                  onValueChange={(value) => {
                    if (value) handleViewModeChangeLocal(value as 'grid' | 'list');
                  }}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid3x3 className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Note
                </Button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <Select
                value={currentFilters.category || 'all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select
                value={currentFilters.tag || 'all'}
                onValueChange={handleTagChange}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Pinned Filter */}
              <Select
                value={
                  currentFilters.isPinned === true
                    ? 'pinned'
                    : currentFilters.isPinned === false
                    ? 'unpinned'
                    : 'all'
                }
                onValueChange={handlePinnedChange}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Pin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Pin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pinned">Đã pin</SelectItem>
                  <SelectItem value="unpinned">Chưa pin</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={`${currentFilters.sortBy || 'updatedAt'}-${currentFilters.sortOrder || 'desc'}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt-desc">Mới cập nhật</SelectItem>
                  <SelectItem value="createdAt-desc">Mới tạo</SelectItem>
                  <SelectItem value="title-asc">Tên A-Z</SelectItem>
                  <SelectItem value="title-desc">Tên Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Archive Toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="showArchived"
                checked={currentFilters.isArchived || false}
                onCheckedChange={(checked) => handleArchivedChange(checked === true)}
              />
              <Label htmlFor="showArchived" className="text-sm text-gray-600 cursor-pointer flex items-center gap-1">
                <Archive className="h-4 w-4" />
                Hiển thị đã lưu trữ
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {displayNotes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <StickyNote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentFilters.search || currentFilters.category || currentFilters.tag
                ? 'Không tìm thấy note nào'
                : 'Chưa có note nào'}
            </h3>
            <p className="text-gray-500 mb-4">
              {currentFilters.search || currentFilters.category || currentFilters.tag
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Tạo note đầu tiên để bắt đầu lưu trữ thông tin'}
            </p>
            {!currentFilters.search && !currentFilters.category && !currentFilters.tag && (
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tạo note đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pinned Section */}
          {!currentFilters.isArchived && pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Pin className="h-4 w-4 fill-blue-600 text-blue-600" />
                <span className="font-medium">Đã pin ({pinnedNotes.length})</span>
              </div>
              <div
                className={
                  viewModeLocal === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleArchive={onToggleArchive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unpinned Section */}
          {!currentFilters.isArchived && unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <StickyNote className="h-4 w-4" />
                  <span className="font-medium">Khác ({unpinnedNotes.length})</span>
                </div>
              )}
              <div
                className={
                  viewModeLocal === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleArchive={onToggleArchive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Archived Section */}
          {currentFilters.isArchived && archivedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Archive className="h-4 w-4" />
                <span className="font-medium">Đã lưu trữ ({archivedNotes.length})</span>
              </div>
              <div
                className={
                  viewModeLocal === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {archivedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleArchive={onToggleArchive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong {total} notes
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) handlePageChange(page - 1);
                      }}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pageNum === page}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <PaginationItem key={pageNum}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) handlePageChange(page + 1);
                      }}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

