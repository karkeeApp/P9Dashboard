import { countries } from 'countries-list';

// Types
import { Option } from '@/types';

export const BooleanOptions: Option<string>[] = [
  {
    key: 'yes',
    label: 'Yes',
    value: JSON.parse('true') as string,
  },
  {
    key: 'no',
    label: 'No',
    value: JSON.parse('false') as string,
  },
];

export const GenderOptions: Option<string>[] = [
  { key: 'm', value: 'm', label: 'Male' },
  { key: 'f', value: 'f', label: 'Female' },
];

export const CountryOptions: Option<string>[] = Object.values(countries).map(
  (country) => ({
    key: country.name,
    label: country.name,
    value: country.name,
  }),
);

// export const CountryCodeOptions: Option<string>[] = Object.values(
//   countries,
// ).map((country) => ({
//   key: country.name,
//   label: `${country.name} (+${country.phone.split(',').join(', +')})`,
//   value: country.phone,
// }));

export const CountryCodeOptions: Option<string>[] = Object.values(
  countries,
).map((country) => ({
  key: country.name,
  label: `${country.name} (+${country.phone.split(',')[0]})`,
  value: `+${country.phone}`,
}));
