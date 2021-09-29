import { useReverseRouter } from '~/utils/use-reverse-router';

export type GmItemKeys =
  | 'hospital_admissions'
  | 'mortality'
  | 'positive_tests'
  | 'sewage_measurement'
  | 'vaccinations';

export type GmCategoryKeys =
  | 'early_indicators'
  | 'hospitals'
  | 'infections'
  | 'vaccinations';

export type VrItemKeys =
  | 'compliance'
  | 'disabled_care'
  | 'elderly_at_home'
  | 'hospital_admissions'
  | 'mortality'
  | 'nursing_home_care'
  | 'positive_tests'
  | 'sewage_measurement'
  | 'source_investigation'
  | 'vaccinations';

export type VrCategoryKeys =
  | 'behaviour'
  | 'early_indicators'
  | 'hospitals'
  | 'infections'
  | 'vaccinations'
  | 'vulnerable_groups';

export type NlItemKeys =
  | 'compliance'
  | 'coronamelder_app'
  | 'disabled_care'
  | 'elderly_at_home'
  | 'general_practitioner_suspicions'
  | 'hospital_admissions'
  | 'intensive_care_admissions'
  | 'measures'
  | 'mortality'
  | 'nursing_home_care'
  | 'positive_tests'
  | 'reproduction_number'
  | 'sewage_measurement'
  | 'source_investigation'
  | 'vaccinations'
  | 'variants';

export type NlCategoryKeys =
  | 'archived_metrics'
  | 'behaviour'
  | 'early_indicators'
  | 'hospitals'
  | 'infections'
  | 'other'
  | 'vaccinations'
  | 'vulnerable_groups';

export type ReverseRouter = ReturnType<typeof useReverseRouter>;

export type SidebarMap<C, I> = (SidebarElement<C, I> | I)[];
export type SidebarElement<C, I> = [category: C, items: I[]];

export type SidebarCategory = {
  title: string;
  items: SidebarItem[];
  key: NlCategoryKeys | VrCategoryKeys | GmCategoryKeys;
};

export type SidebarItem = {
  title: string;
  icon: React.ReactElement;
  href: string;
  key: NlItemKeys | VrItemKeys | GmItemKeys;
};

export type ExpandedSidebarMap = (SidebarCategory | SidebarItem)[];
