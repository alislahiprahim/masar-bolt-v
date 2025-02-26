export interface City {
  id: string;
  name: string;
  imageUrl: string;
  description: string;

  _count: { trips: number; galleryImages: number };
}

export interface CityState {
  cities: City[];
  loading: boolean;
  error: string | null;
  total: number;
  filters: {
    search: string;
    destination: string;
  };
  pagination: {
    page: number;
    limit: number;
  };
}
