import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-search-results';
  onAction?: () => void;
  searchTerm?: string;
}

export default function EmptyState({ type, onAction, searchTerm }: EmptyStateProps) {
  if (type === 'no-search-results') {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy task nào
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Không có kết quả nào cho "{searchTerm}". Thử thay đổi từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        Chưa có task nào
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Tạo task đầu tiên để bắt đầu quản lý công việc của bạn.
      </p>
      {onAction && (
        <Button className="mt-4" onClick={onAction}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Task
        </Button>
      )}
    </div>
  );
}
