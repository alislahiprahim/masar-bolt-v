export interface GalleryImage {
  id: string;
  filePath: string;
  title: string;
  location: string;
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