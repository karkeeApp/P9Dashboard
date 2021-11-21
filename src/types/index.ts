export type Modify<T, R> = Omit<T, keyof R> & R;

export interface Option<T> {
  key: string | number;
  label: string;
  value: T;
}

export interface Pagination {
  page: number;
  size?: number;
}
