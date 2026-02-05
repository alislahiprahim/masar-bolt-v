export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  city: { name: string };
  description?: string;
  tags?: string[];
  date?: string;
}

export interface GalleryState {
  images: GalleryImage[];
  selectedImage: GalleryImage | null;
  loading: boolean;
  error: string | null;
  total: number;
  filters: {
    location?: string;
    tag?: string;
    search?: string;
  };
}
