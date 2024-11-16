export interface Student {
  id: string;
  name: Name;
  notes: Note[];
}

export interface Name {
  first: string;
  last: string;
}

export interface Note {
  id: string;
  competency_id: string;
  value: number;
  created_at: Date;
  updated_at: Date;
}
