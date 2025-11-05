'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pin, Archive, Edit, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { Note } from '@/lib/notesAPI';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
}

// Helper function to detect and extract links from content
const extractLinks = (text: string): Array<{ url: string; text: string }> => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];
  
  return matches.map(url => ({
    url,
    text: url.length > 50 ? url.substring(0, 50) + '...' : url,
  }));
};

// Helper function to render content with highlighted links
const renderContentWithLinks = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {part.length > 50 ? part.substring(0, 50) + '...' : part}
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: NoteCardProps) {
  const borderColor = note.color || '#3b82f6';
  const links = extractLinks(note.content);

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 hover:shadow-lg cursor-pointer group',
        note.isPinned && 'ring-2 ring-blue-400',
        note.isArchived && 'opacity-60'
      )}
      style={{ borderLeftColor: borderColor, borderLeftWidth: '4px' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {note.isPinned && (
                <Pin className="h-4 w-4 text-blue-600 fill-blue-600 flex-shrink-0" />
              )}
              <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
            </div>
            {note.category && (
              <Badge variant="outline" className="text-xs mt-1">
                {note.category}
              </Badge>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTogglePin(note._id)}>
                <Pin className={cn('mr-2 h-4 w-4', note.isPinned && 'fill-current')} />
                {note.isPinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleArchive(note._id)}>
                <Archive className="mr-2 h-4 w-4" />
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(note._id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(note._id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {note.content && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-3 break-words">
            {renderContentWithLinks(note.content)}
          </p>
        )}

        {links.length > 0 && (
          <div className="mb-3 space-y-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                <span className="truncate">{link.text}</span>
              </a>
            ))}
          </div>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          {new Date(note.updatedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      </CardContent>
    </Card>
  );
}

