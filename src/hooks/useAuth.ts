import { useMutation, UseMutationResult } from '@tanstack/react-query';
import API from '../API';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface LoginPayload {
  phone: string;
  password: string;
}

interface LoginResponse {
  refresh?: string;
  access?: string;
  status?: boolean;
  detail?: string;
}

interface AdminProfile {
  id: number;
  name: string;
  phone: string;
}

const useLogin = (): UseMutationResult<LoginResponse, Error, LoginPayload, unknown> => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<LoginResponse> => {
      // First get the token
      const loginResponse = await API.post('/auth/login/', payload);
      const data = loginResponse.data;

      if (data.refresh && data.access) {
        // Store tokens temporarily
        const tempAccessToken = data.access;
        const tempRefreshToken = data.refresh;

        try {
          // Check if user is admin with the new token
          await API.get<AdminProfile>('/auth/admin/profile', {
            headers: {
              Authorization: `Bearer ${tempAccessToken}`
            }
          });

          // If successful, return the login data
          return data;
        } catch (error) {
          if ((error as AxiosError)?.response?.status === 403) {
            toast.error('Siz admin emassiz');
            throw new Error('Not an admin');
          }
          throw error;
        }
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.refresh && data.access) {
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('accessToken', data.access);
        toast.success('Tizimga muvaffaqiyatli kirdingiz');
        navigate('/profile');
      } else if (data.status === false) {
        toast.error(data.detail || 'Login xatolik yuz berdi');
        console.error('Login failed:', data.detail);
      }
    },
    onError: error => {
      if (error.message !== 'Not an admin') {
        toast.error('Tizimga kirishda xatolik yuz berdi');
        console.error('An error occurred during login:', (error as Error).message);
      }
    },
  });
};

export default useLogin;
