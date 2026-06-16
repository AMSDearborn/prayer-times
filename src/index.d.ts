import { ComponentType } from "react";

export interface PrayerTimesWidgetProps {
  /** Coordinates for prayer time calculation. Defaults to AMS Dearborn. */
  location?: { latitude: number; longitude: number };
  /** Base path for static assets (fonts, icons, ads). Defaults to "/" */
  basePath?: string;
}

export interface PrayerTableProps {
  monthData: any[] | null;
  month: number;
  loading: boolean;
  error: string | null;
  basePath?: string;
}

export interface AdsTableProps {
  monthData: any[] | null;
  month: number;
  basePath?: string;
}

export interface HeaderProps {
  monthData: any[] | null;
  month: number;
  basePath?: string;
}

export declare const PrayerTimesWidget: ComponentType<PrayerTimesWidgetProps>;
export declare const PrayerTable: ComponentType<PrayerTableProps>;
export declare const AdsTable: ComponentType<AdsTableProps>;
export declare const Header: ComponentType<HeaderProps>;

export declare const HIJRI_MONTHS_AR: string[];
export declare const HIJRI_MONTHS_EN: string[];
export declare const GREGORIAN_MONTHS: string[];
export declare const DAY_ABBREVIATIONS: Record<string, string>;
export declare const ARABIC_DAY_CORRECTIONS: Record<string, string>;
