'use server';

import { getCurrentUser, type User, updateUser } from '@/app/lib/api/services/user.service';
import { revalidatePath } from 'next/cache';

export type ProfileState = {
  error?: string;
  user?: User;
}

export async function fetchUserProfile(): Promise<ProfileState> {
  try {
    const user = await getCurrentUser();
    return { user };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      error: 'Failed to load profile. Please try again later.',
    };
  }
}

export type UpdateUserFormState = {
  message?: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userName?: string[];
    email?: string[];
    phoneNumber?: string[];
  };
};

export async function updateUserProfile(prevState: UpdateUserFormState, formData: FormData): Promise<UpdateUserFormState> {
  try {
    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    // Basic validation
    const errors: UpdateUserFormState['errors'] = {};
    
    if (!userData.userName?.trim()) {
      errors.userName = ['Username is required'];
    }
    if (!userData.email?.trim()) {
      errors.email = ['Email is required'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    await updateUser(userData);
    revalidatePath('/account/profile');
    return { message: 'Profile updated successfully' };
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      message: 'Failed to update profile. Please try again later.',
    };
  }
}