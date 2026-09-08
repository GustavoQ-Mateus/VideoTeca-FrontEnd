export type FilmRecord = {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string;
  duration: string;
  language: string;
  rating: string;
  media: string;
  cover: string;
  status: string;
  location: string;
  originalTitle?: string;
  synopsis?: string;
  cast?: string;
  subtitles?: string;
  country?: string;
  internalCode?: string;
  relatedIds?: number[];
};

export type EventRecord = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  film: string;
  slots: number;
  enrolled: number;
  type: string;
  banner: string;
  description: string;
  certificate: boolean;
};

export type LoanRecord = {
  id: number;
  film: string;
  student: string;
  course: string;
  borrowed: string;
  due: string;
  status: string;
  copy: string;
};

export type RoomRecord = {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
  status: string;
};
