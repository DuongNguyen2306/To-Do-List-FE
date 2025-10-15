'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, User, Lock, Trash2, Camera } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const profileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .required('Tên là bắt buộc'),
  avatarUrl: Yup.string()
    .url('URL avatar không hợp lệ')
    .optional(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await profileAPI.getProfile();
      console.log('Profile API response:', response.data);
      
      // API trả về { user: {...} }, cần extract user object
      const userData = response.data.user || response.data;
      console.log('Profile data extracted:', userData);
      setProfile(userData);
    } catch (error: any) {
      setError('Không thể tải thông tin profile');
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (values: { name: string; avatarUrl: string }) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      const response = await profileAPI.updateProfile(values);
      console.log('Update profile response:', response.data);
      
      // API trả về { user: {...} }, cần extract user object
      const userData = response.data.user || response.data;
      setProfile(userData);
      
      // Update user in context
      updateUser({
        name: userData.name,
        avatarUrl: userData.avatarUrl
      });
      
      setSuccess('Cập nhật profile thành công!');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể cập nhật profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (values: { 
    currentPassword: string; 
    newPassword: string; 
  }) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      await profileAPI.changePassword(values);
      setSuccess('Đổi mật khẩu thành công!');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      await profileAPI.deleteAccount({ password: deletePassword });
      // Redirect to login after successful deletion
      router.push('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể xóa tài khoản');
    } finally {
      setIsSaving(false);
      setShowDeleteDialog(false);
      setDeletePassword('');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và tài khoản</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
              <TabsTrigger value="danger">Tài khoản</TabsTrigger>
            </TabsList>

            {/* Profile Information */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Formik
                    initialValues={{
                      name: profile?.name || '',
                      avatarUrl: profile?.avatarUrl || '',
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleUpdateProfile}
                    enableReinitialize
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={profile?.avatarUrl} />
                            <AvatarFallback className="text-lg">
                              {profile?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Field
                              as={Input}
                              id="avatarUrl"
                              name="avatarUrl"
                              placeholder="https://example.com/avatar.jpg"
                              className={errors.avatarUrl && touched.avatarUrl ? 'border-red-500' : ''}
                            />
                            {errors.avatarUrl && touched.avatarUrl && (
                              <p className="text-sm text-red-500">{errors.avatarUrl}</p>
                            )}
                          </div>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên *</Label>
                          <Field
                            as={Input}
                            id="name"
                            name="name"
                            placeholder="Nhập họ và tên"
                            className={errors.name && touched.name ? 'border-red-500' : ''}
                          />
                          {errors.name && touched.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                          )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={profile?.email || ''}
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-sm text-gray-500">Email không thể thay đổi</p>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || isSaving}
                          className="w-full sm:w-auto"
                        >
                          {(isSubmitting || isSaving) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang cập nhật...
                            </>
                          ) : (
                            'Cập nhật thông tin'
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Change Password */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Đổi mật khẩu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Formik
                    initialValues={{
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    }}
                    validationSchema={passwordSchema}
                    onSubmit={handleChangePassword}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
                          <Field
                            as={Input}
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            className={errors.currentPassword && touched.currentPassword ? 'border-red-500' : ''}
                          />
                          {errors.currentPassword && touched.currentPassword && (
                            <p className="text-sm text-red-500">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                          <Field
                            as={Input}
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            className={errors.newPassword && touched.newPassword ? 'border-red-500' : ''}
                          />
                          {errors.newPassword && touched.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
                          <Field
                            as={Input}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            className={errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}
                          />
                          {errors.confirmPassword && touched.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || isSaving}
                          className="w-full sm:w-auto"
                        >
                          {(isSubmitting || isSaving) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang đổi mật khẩu...
                            </>
                          ) : (
                            'Đổi mật khẩu'
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone */}
            <TabsContent value="danger">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Vùng nguy hiểm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Xóa tài khoản</h3>
                      <p className="text-sm text-gray-600">
                        Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                      </p>
                    </div>
                    
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa tài khoản
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Account Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. 
                Vui lòng nhập mật khẩu để xác nhận.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deletePassword">Mật khẩu xác nhận</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Nhập mật khẩu để xác nhận"
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isSaving}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  'Xóa tài khoản'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}
