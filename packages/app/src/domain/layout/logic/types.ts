export type Layout = 'nl' | 'vr' | 'gm';

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
  | 'measures'
  | 'mortality'
  | 'nursing_home_care'
  | 'positive_tests'
  | 'sewage_measurement'
  | 'source_investigation'
  | 'vaccinations';

export type VrCategoryKeys =
  | 'archived_metrics'
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
  | 'infectious_people'
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

export type CategoryKeys<T extends Layout> = T extends 'nl'
  ? NlCategoryKeys
  : T extends 'vr'
  ? VrCategoryKeys
  : GmCategoryKeys;

export type ItemKeys<T extends Layout> = T extends 'nl'
  ? NlItemKeys
  : T extends 'vr'
  ? VrItemKeys
  : GmItemKeys;

/**
 * The following types are consumed by the useSidebar hook.
 */
export type SidebarMap<T extends Layout> = (SidebarElement<T> | ItemKeys<T>)[];

export type SidebarElement<T extends Layout> = [
  category: CategoryKeys<T>,
  items: ItemKeys<T>[]
];

/**
 * The following types are returned by the useSidebar hook.
 */
export type SidebarCategory<T extends Layout> = {
  key: CategoryKeys<T>;
  title: string;
  description?: string;
  items: SidebarItem<T>[];
};

export type SidebarItem<T extends Layout> = {
  key: ItemKeys<T>;
  title: string;
  icon: React.ReactElement;
  href: string | undefined;
};

export type ExpandedSidebarMap<T extends Layout> = (
  | SidebarCategory<T>
  | SidebarItem<T>
)[];
