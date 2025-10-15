'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-1 sm:space-x-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-xs sm:text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                TodoApp
              </span>
            </Link>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100 transition-all duration-200 group">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
                      {user?.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name || 'User'} 
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${user?.avatarUrl ? 'hidden' : ''}`}>
                        {getInitials(user?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 mx-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {user?.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name || 'User'} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {getInitials(user?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-gray-500">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-3 h-4 w-4 text-blue-600" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Link href="/profile" className="flex items-center w-full">
                      <Settings className="mr-3 h-4 w-4 text-gray-600" />
                      <span className="font-medium">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <LogOut className="mr-3 h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-600">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
