import { ComponentType } from 'react';

export interface NavMenu {
  [key: string]: unknown;
  key: string;
  path: string;
  name: string;
  title: string;
  icon?: ComponentType;
  breadcrumb: boolean;
  submenu: NavMenu[];
}
