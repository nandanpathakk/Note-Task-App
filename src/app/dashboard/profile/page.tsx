'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Loader2, 
  Save, 
  LogOut, 
  Trash2, 
  Edit, 
  X 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, updateUserName, signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    setIsUpdating(true);
    const { error } = await updateUserName(name);
    setIsUpdating(false);

    if (error) {
      toast.error(error.message || "Update failed");
    } else {
      toast.success("Your profile has been updated successfully");
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("You have been logged out");
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error)
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would be implemented with your Supabase client
    toast.success("Account deletion initiated. You will receive a confirmation email.");
    setIsDeleteDialogOpen(false);
    // Actual implementation would call a function to delete the account
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Get user initials for avatar fallback
  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || '??';
  
  // Create avatar image URL from email (using Gravatar)
  const emailMd5 = user.email ? btoa(user.email.trim().toLowerCase()) : '';
  const avatarUrl = `https://www.gravatar.com/avatar/${emailMd5}?d=mp`;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with avatar - only visible on large screens */}
          <div className="hidden lg:flex flex-col items-center">
            <Avatar className="h-40 w-40 border-4 border-background shadow-md">
              <AvatarImage src={avatarUrl} alt={user.user_metadata?.full_name || 'User'} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mt-4">{user.user_metadata?.full_name || 'User'}</h2>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            
            <div className="flex w-full mt-6 space-y-2 space-x-3">
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className=""
              >
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Log Out
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
                className=""
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
          
          {/* Main content - takes full width on mobile, 2/3 on large screens */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-muted">
              {/* Mobile avatar header - only visible on mobile and tablet */}
              <CardHeader className="flex flex-col items-center space-y-4 pb-6 lg:hidden">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={avatarUrl} alt={user.user_metadata?.full_name || 'User'} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || 'User'}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      <label htmlFor="name" className="text-sm font-medium leading-none">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                          <p className="font-medium">{user.user_metadata?.full_name || 'Not set'}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                        <p className="font-medium">{new Date(user.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.user_metadata?.full_name || '');
                      }}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {/* Mobile-only footer */}
              <CardFooter className="flex flex-col sm:flex-row gap-2 py-6 lg:hidden">
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="w-full sm:flex-1"
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Log Out
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full sm:flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This is a dummy button and currently not functional
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}