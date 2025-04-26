import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'sonner';

export interface AdminProfile {
  id: number;
  name: string;
  phone: string;
  image?: string | null;
}

export interface ProfileUpdatePayload {
  name: string;
  phone: string;
  image?: File | null;
}

const fetchProfile = async (): Promise<AdminProfile> => {
  try {
    const response = await API.get('/auth/admin/profile');
    return response.data;
  } catch (error) {
    toast.error('Profil ma\'lumotlarini yuklashda xatolik yuz berdi');
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('phone', payload.phone);
      
      if (payload.image) {
        formData.append('image', payload.image);
      }
      
      const response = await API.patch('/auth/admin/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profil muvaffaqiyatli yangilandi');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      toast.error('Profilni yangilashda xatolik yuz berdi');
      console.error('Error updating profile:', error);
    },
  });
}; 