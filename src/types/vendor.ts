import { Moment } from 'moment';

// Types
import { User } from './user';

export interface Vendor extends User {}

export interface VendorFormData {
  // Member Details
  firstname: string;
  lastname: string;
  about: string;
  email: string;
  password: string;
  mobile: string;
  add_1: string;
  add_2: string;
  postal_code: number;
  country: string;

  // Vendor Details
  vendor_name: string;
  vendor_description: string;

  // Company Details
  company: string;
  founded_date: Moment | Date | string;
  profession: string;
  company_add_1: string;
  company_add_2: string;
  contact_person: string;
}
