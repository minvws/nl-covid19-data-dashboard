import { Maatregelen, Archive, Eye, MedischeScreening } from '@corona-dashboard/icons';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { ReverseRouter, useReverseRouter } from '~/utils/use-reverse-router';
import { ExpandedSidebarMap, ItemKeys, Layout, SidebarCategory, SidebarElement, SidebarItem, SidebarMap } from './types';

const mapCategoriesToIcons = {
  development_of_the_virus: <Eye />,
  consequences_for_healthcare: <MedischeScreening />,
  actions_to_take: <Maatregelen />,
  archived_metrics: <Archive />,
} as const;

const mapKeysToReverseRouter = {
  compliance: 'gedrag',
  coronamelder_app: 'coronamelder',
  corona_thermometer: 'coronaThermometer',
  current_advices: 'geldendeAdviezen',
  disabled_care: 'gehandicaptenzorg',
  elderly_at_home: 'thuiswonende70Plussers',
  general_practitioner_suspicions: 'klachtenBijHuisartsen',
  hospital_admissions: 'ziekenhuisopnames',
  hospitals_and_care: 'ziekenhuizenInBeeld',
  infectious_people: 'besmettelijkeMensen',
  intensive_care_admissions: 'intensiveCareOpnames',
  mortality: 'sterfte',
  // Still the nursing home care name is used because of legacy naming inside of sanity's lokalize texts.
  nursing_home_care: 'kwetsbareGroepen',
  patients: 'patientenInBeeld',
  positive_tests: 'positieveTesten',
  reproduction_number: 'reproductiegetal',
  sewage_measurement: 'rioolwater',
  infection_radar: 'infectieradar',
  the_corona_vaccine: 'deCoronaprik',
  variants: 'varianten',
} as const;

type UseSidebarArgs<T extends Layout> = {
  layout: T;
  map: SidebarMap<T>;
  code?: T extends 'nl' ? never : string;
};

type Content = {
  title: string;
};

export function useSidebar<T extends Layout>({ layout, map, code }: UseSidebarArgs<T>): ExpandedSidebarMap<T> {
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  return useMemo(() => {
    const getHref = (key: ItemKeys<T>) => {
      const route = mapKeysToReverseRouter[key];
      if (layout === 'nl') {
        return reverseRouter.nl[route]();
      }

      if (layout === 'gm' && isPresent(code)) {
        return reverseRouter.gm[route as keyof ReverseRouter['gm']](code);
      }
    };

    const getItem = (key: ItemKeys<T>): SidebarItem<T> => {
      return {
        key,
        title: commonTexts.sidebar.metrics[key].title,
        href: getHref(key),
      };
    };

    const getCategory = (category: SidebarElement<T>): SidebarCategory<T> => {
      const [key, items] = category;
      const content: Content = commonTexts.sidebar.categories[key];
      const icon = mapCategoriesToIcons[key];

      return {
        key,
        title: content.title,
        icon,
        items: items.map(getItem),
      };
    };

    const expandMap = (map: SidebarMap<T>): ExpandedSidebarMap<T> => map.map((x) => (typeof x === 'string' ? getItem(x) : getCategory(x)));

    return expandMap(map);
  }, [code, layout, map, reverseRouter, commonTexts.sidebar]);
}
