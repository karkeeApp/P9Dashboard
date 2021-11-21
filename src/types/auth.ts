// Types
import { ResponseData } from '@/types/api';

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponseData extends ResponseData<undefined> {
  token: string;
}
