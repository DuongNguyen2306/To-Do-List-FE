'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string, hardDelete?: boolean) => void;
  onTaskMoveToNextDay: (taskId: string) => void;
  onCreateTask: () => void;
  isLoading?: boolean;
}

const STATUSES = [
  { id: 'To do', title: 'To do', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'In progress', title: 'In progress', color: 'bg-purple-50 border-purple-200' },
  { id: 'On approval', title: 'On approval', color: 'bg-green-50 border-green-200' },
  { id: 'Done', title: 'Done', color: 'bg-pink-50 border-pink-200' },
];

export default function KanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskEdit,
  onTaskDelete,
  onTaskMoveToNextDay,
  onCreateTask,
  isLoading = false
}: KanbanBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks by search term and date
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by date (dueDate or createdAt)
    const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
    const isSameDay = taskDate.toDateString() === selectedDate.toDateString();
    
    return matchesSearch && isSameDay;
  });

  // Group tasks by status
  const tasksByStatus = STATUSES.map(status => ({
    ...status,
    tasks: filteredTasks.filter(task => task.status === status.id)
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overData = over.data.current;

    console.log('Drag end:', { taskId, overData });

    // Check if we're dropping on a column
    if (overData?.type === 'column') {
      const newStatus = overData.status;
      
      // Find the task to get current status
      const task = tasks.find(t => t._id === taskId);
      if (task && task.status !== newStatus) {
        console.log('Updating task status from', task.status, 'to', newStatus);
        onTaskUpdate(taskId, newStatus);
      }
    } else {
      console.log('Not dropping on a valid column');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const overData = over.data.current;

    console.log('Drag over:', { taskId, overData });

    // Check if we're dropping on a column
    if (overData?.type === 'column') {
      const newStatus = overData.status;
      
      const task = tasks.find(t => t._id === taskId);
      if (task && task.status !== newStatus) {
        console.log('Updating task status from', task.status, 'to', newStatus);
        onTaskUpdate(taskId, newStatus);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col space-y-4 p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200/50">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Task Board
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Quản lý công việc theo ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Date Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 border border-gray-200/50 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-[140px] sm:w-[180px] justify-start text-left font-normal hover:bg-gray-100 text-xs sm:text-sm">
                  <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-gray-700 truncate">{format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-xl border-0 mx-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                setSelectedDate(nextDay);
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Tìm kiếm task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 w-full h-9 sm:h-10 bg-white/80 backdrop-blur-sm border-gray-200/50 focus:border-blue-300 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>

          {/* Add Task Button */}
          <Button 
            onClick={onCreateTask}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-9 sm:h-10 text-xs sm:text-sm sm:px-6"
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Thêm Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 min-w-max">
            {tasksByStatus.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                taskCount={column.tasks.length}
              >
                <SortableContext
                  items={column.tasks.map(task => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.tasks.map((task) => (
                    <KanbanTaskCard
                      key={task._id}
                      task={task}
                      onEdit={() => onTaskEdit(task)}
                      onDelete={(hardDelete) => onTaskDelete(task._id, hardDelete)}
                      onMoveToNextDay={() => onTaskMoveToNextDay(task._id)}
                      isDragging={activeId === task._id}
                    />
                  ))}
                </SortableContext>
              </KanbanColumn>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
