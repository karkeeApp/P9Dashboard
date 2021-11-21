export interface ResponseData<T = undefined> {
  code: number;
  total: number;
  data: T;
}

export interface ErrorResponseData {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
}
