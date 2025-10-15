'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  taskCount: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, color, taskCount, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column',
      status: id
    }
  });

  const getColumnBgColor = (title: string) => {
    switch (title) {
      case 'To do':
        return 'bg-gradient-to-br from-blue-300 to-blue-400 border-blue-500 shadow-blue-200/50';
      case 'In progress':
        return 'bg-gradient-to-br from-yellow-300 to-yellow-400 border-yellow-500 shadow-yellow-200/50';
      case 'On approval':
        return 'bg-gradient-to-br from-purple-300 to-purple-400 border-purple-500 shadow-purple-200/50';
      case 'Done':
        return 'bg-gradient-to-br from-green-300 to-green-400 border-green-500 shadow-green-200/50';
      default:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 shadow-gray-200/50';
    }
  };

  return (
    <div className="flex flex-col w-80 sm:w-96 lg:w-[320px] xl:w-[360px]">
      <Card className={`${getColumnBgColor(title)} border-2 ${isOver ? 'border-blue-400 shadow-lg scale-105' : ''} transition-all duration-200 shadow-xl hover:shadow-2xl backdrop-blur-sm`}>
        <CardHeader className="pb-2 sm:pb-3 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1 sm:space-x-2 drop-shadow-sm">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${title === 'To do' ? 'bg-blue-500' : title === 'In progress' ? 'bg-yellow-500' : title === 'On approval' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
              <span className="text-xs sm:text-sm">{title}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1">
              {taskCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent 
          ref={setNodeRef}
          className="pt-0 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] space-y-3 sm:space-y-4"
        >
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
