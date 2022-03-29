import {
  Arts,
  Coronavirus,
  Elderly,
  Gedrag,
  GehandicaptenZorg,
  Maatregelen,
  Phone,
  Reproductiegetal,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Varianten,
  Verpleeghuiszorg,
  Ziekenhuis,
  Ziektegolf,
} from '@corona-dashboard/icons';
import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { ReverseRouter, useReverseRouter } from '~/utils/use-reverse-router';
import {
  ExpandedSidebarMap,
  ItemKeys,
  Layout,
  SidebarCategory,
  SidebarElement,
  SidebarItem,
  SidebarMap,
} from './types';

const mapKeysToIcons = {
  hospital_admissions: <Ziekenhuis />,
  positive_tests: <Test />,
  mortality: <Coronavirus />,
  sewage_measurement: <RioolwaterMonitoring />,
  source_investigation: <Gedrag />,
  nursing_home_care: <Verpleeghuiszorg />,
  compliance: <Gedrag />,
  disabled_care: <GehandicaptenZorg />,
  elderly_at_home: <Elderly />,
  infectious_people: <Ziektegolf />,
  measures: <Maatregelen />,
  reproduction_number: <Reproductiegetal />,
  general_practitioner_suspicions: <Arts />,
  coronamelder_app: <Phone />,
  variants: <Varianten />,
  intensive_care_admissions: <Arts />,
  vaccinations: <Vaccinaties />,
} as const;

const mapKeysToReverseRouter = {
  compliance: 'gedrag',
  coronamelder_app: 'coronamelder',
  disabled_care: 'gehandicaptenzorg',
  elderly_at_home: 'thuiswonendeOuderen',
  general_practitioner_suspicions: 'verdenkingenHuisartsen',
  hospital_admissions: 'ziekenhuisopnames',
  infectious_people: 'besmettelijkeMensen',
  intensive_care_admissions: 'intensiveCareOpnames',
  measures: 'maatregelen',
  mortality: 'sterfte',
  nursing_home_care: 'verpleeghuiszorg',
  positive_tests: 'positiefGetesteMensen',
  sewage_measurement: 'rioolwater',
  source_investigation: 'brononderzoek',
  vaccinations: 'vaccinaties',
  variants: 'varianten',
  reproduction_number: 'reproductiegetal',
} as const;

type UseSidebarArgs<T extends Layout> = {
  layout: T;
  map: SidebarMap<T>;
  code?: T extends 'nl' ? never : string;
};

type Content = {
  title: string;
  description?: string;
};

export function useSidebar<T extends Layout>({
  layout,
  map,
  code,
}: UseSidebarArgs<T>): ExpandedSidebarMap<T> {
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  return useMemo(() => {
    const getHref = (key: ItemKeys<T>) => {
      const route = mapKeysToReverseRouter[key];

      if (layout === 'in') {
        return reverseRouter.in[route as keyof ReverseRouter['in']]();
      }

      if (layout === 'nl') {
        return reverseRouter.nl[route]();
      }

      if (layout === 'vr' && isPresent(code)) {
        return reverseRouter.vr[route as keyof ReverseRouter['vr']](code);
      }

      if (layout === 'gm' && isPresent(code)) {
        return reverseRouter.gm[route as keyof ReverseRouter['gm']](code);
      }
    };

    const getItem = (key: ItemKeys<T>): SidebarItem<T> => {
      const icon = mapKeysToIcons[key];

      return {
        key,
        title: commonTexts.sidebar.metrics[key].title,
        icon,
        href: getHref(key),
      };
    };

    const getCategory = (category: SidebarElement<T>): SidebarCategory<T> => {
      const [key, items] = category;
      const content: Content = commonTexts.sidebar.categories[key];

      return {
        key,
        title: content.title,
        description: isPresent(content?.description)
          ? content.description
          : undefined,
        items: items.map(getItem),
      };
    };

    const expandMap = (map: SidebarMap<T>): ExpandedSidebarMap<T> =>
      map.map((x) => (typeof x === 'string' ? getItem(x) : getCategory(x)));

    return expandMap(map);
  }, [code, layout, map, reverseRouter, commonTexts.sidebar]);
}
