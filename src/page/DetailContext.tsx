import { createContext } from 'solid-js';
import type { FontReporter } from '../components/fonts/FontReporter';

export interface DetailContextType {
    reporter: FontReporter;
    packageName: string;
    subName: string;
    cnName: string;
}
export const DetailedContext = createContext<DetailContextType>();
