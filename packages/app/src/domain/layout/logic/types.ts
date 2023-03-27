export type Layout = 'nl' | 'gm';

type SharedCategoryKeys = 'development_of_the_virus' | 'consequences_for_healthcare' | 'actions_to_take';

export type GmItemKeys = 'hospital_admissions' | 'mortality' | 'positive_tests' | 'sewage_measurement' | 'vaccinations';

export type GmCategoryKeys = SharedCategoryKeys | 'archived_metrics';

export type NlItemKeys =
  | 'compliance'
  | 'coronamelder_app'
  | 'disabled_care'
  | 'elderly_at_home'
  | 'general_practitioner_suspicions'
  | 'hospitals_and_care'
  | 'patients'
  | 'infectious_people'
  | 'mortality'
  | 'nursing_home_care'
  | 'positive_tests'
  | 'reproduction_number'
  | 'sewage_measurement'
  | 'vaccinations'
  | 'variants';

export type NlCategoryKeys = SharedCategoryKeys | 'archived_metrics';

export type CategoryKeys<T extends Layout> = T extends 'nl' ? NlCategoryKeys : GmCategoryKeys;

export type ItemKeys<T extends Layout> = T extends 'nl' ? NlItemKeys : GmItemKeys;

/**
 * The following types are consumed by the useSidebar hook.
 */
export type SidebarMap<T extends Layout> = (SidebarElement<T> | ItemKeys<T>)[];

export type SidebarElement<T extends Layout> = [category: CategoryKeys<T>, items: ItemKeys<T>[]];

/**
 * The following types are returned by the useSidebar hook.
 */
export type SidebarCategory<T extends Layout> = {
  key: CategoryKeys<T>;
  title: string;
  icon: React.ReactElement;
  items: SidebarItem<T>[];
};

export type SidebarItem<T extends Layout> = {
  key: ItemKeys<T>;
  title: string;
  href: string | undefined;
};

export type ExpandedSidebarMap<T extends Layout> = (SidebarCategory<T> | SidebarItem<T>)[];
