export interface Review {
  id: string;
  userId: string;
  tripId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
  helpful: number;
}