import {createContext} from 'react';

export interface RefreshMechanismInt {
  value: boolean;
}
export const RefreshMechanism = createContext<RefreshMechanismInt | null>(null);

export interface RefresherInt {
  refresh: () => void;
}
export const Refresher = createContext<RefresherInt | null>(null);
