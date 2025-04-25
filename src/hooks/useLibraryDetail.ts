import { useQuery } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'sonner';

export interface Book {
  id: number;
  library: number;
  name: string;
  author: string;
  publisher: string;
  quantity_in_library: number;
}

export interface LibraryDetail {
  library: {
    id: number;
    user: number;
    name: string;
    image: string | null;
    address: string;
    social_media: {
      telegram?: string;
      [key: string]: string | undefined;
    };
    can_rent_books: boolean;
    latitude: string;
    longitude: string;
    google_maps_url: string;
  };
  phone: string;
  is_active: boolean;
  books: Book[];
  total_books: number;
}

export interface LibraryDetailResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LibraryDetail;
}

const fetchLibraryDetail = async (libraryId: number): Promise<LibraryDetailResponse> => {
  try {
    const response = await API.get(`https://s-libraries.uz/api/v1/libraries/library/${libraryId}/`);
    return response.data;
  } catch (error) {
    toast.error("Kutubxona ma'lumotlarini yuklashda xatolik yuz berdi");
    console.error('Error fetching library details:', error);
    throw error;
  }
};

export const useLibraryDetail = (libraryId: number) => {
  return useQuery({
    queryKey: ['library', libraryId],
    queryFn: () => fetchLibraryDetail(libraryId),
    enabled: !!libraryId,
  });
};
