import {
  Coronavirus,
  Ziekenhuis,
  Test,
  RioolwaterMonitoring,
  Gedrag,
  Verpleeghuiszorg,
  GehandicaptenZorg,
  Elderly,
  Ziektegolf,
  Maatregelen,
  Reproductiegetal,
  Arts,
  Phone,
  Varianten,
  Vaccinaties,
} from '@corona-dashboard/icons';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useMemo } from 'react';
import { useIntl } from '~/intl';
import {
  ExpandedSidebarMap,
  GmCategoryKeys,
  GmItemKeys,
  NlCategoryKeys,
  NlItemKeys,
  ReverseRouter,
  SidebarCategory,
  SidebarElement,
  SidebarItem,
  SidebarMap,
  VrCategoryKeys,
  VrItemKeys,
} from '../types';
import { assert } from 'console';

const mapKeysToIcons: Record<
  NlItemKeys | VrItemKeys | GmItemKeys,
  React.ReactElement
> = {
  hospital_admissions: <Ziekenhuis />,
  positive_tests: <Test />,
  mortality: <Coronavirus />,
  sewage_measurement: <RioolwaterMonitoring />,
  source_investigation: <Gedrag />,
  nursing_home_care: <Verpleeghuiszorg />,
  compliance: <Gedrag />,
  disabled_care: <GehandicaptenZorg />,
  elderly_at_home: <Elderly />,
  infected_people: <Ziektegolf />,
  measures: <Maatregelen />,
  reproduction_number: <Reproductiegetal />,
  general_practitioner_suspicions: <Arts />,
  coronamelder_app: <Phone />,
  variants: <Varianten />,
  intensive_care_admissions: <Arts />,
  vaccinations: <Vaccinaties />,
};

const mapKeysToReverseRouter: Record<
  NlItemKeys | VrItemKeys | GmItemKeys,
  | keyof ReverseRouter['nl']
  | keyof ReverseRouter['vr']
  | keyof ReverseRouter['gm']
> = {
  compliance: 'gedrag',
  coronamelder_app: 'coronamelder',
  disabled_care: 'gehandicaptenzorg',
  elderly_at_home: 'thuiswonendeOuderen',
  general_practitioner_suspicions: 'verdenkingenHuisartsen',
  hospital_admissions: 'ziekenhuisopnames',
  infected_people: 'besmettelijkeMensen',
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

type UseSidebarArgs =
  | {
      layout: 'nl';
      map: SidebarMap<NlCategoryKeys, NlItemKeys>;
      code?: never;
    }
  | {
      layout: 'vr';
      map: SidebarMap<VrCategoryKeys, VrItemKeys>;
      code: string;
    }
  | {
      layout: 'gm';
      map: SidebarMap<GmCategoryKeys, GmItemKeys>;
      code: string;
    };

export function useSidebar<
  C extends NlCategoryKeys | VrCategoryKeys | GmCategoryKeys,
  I extends NlItemKeys | VrItemKeys | GmItemKeys
>({ layout, map, code }: UseSidebarArgs): ExpandedSidebarMap {
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  assert(
    layout && (layout === 'nl' || layout === 'vr' || layout === 'gm'),
    'layout is required and must be nl, vr or gm'
  );
  assert(Array.isArray(map), 'map is required');
  assert(
    (layout === 'gm' || layout === 'vr') && code,
    'code is required for vr and gm'
  );

  function getHref<K extends NlItemKeys | VrItemKeys | GmItemKeys>(key: K) {
    switch (layout) {
      case 'nl':
        return reverseRouter.nl[mapKeysToReverseRouter[key]];
      case 'vr':
        return reverseRouter.vr[mapKeysToReverseRouter[key]](code);
      case 'gm':
        return reverseRouter.gm[mapKeysToReverseRouter[key]](code);
      default:
        return '';
    }
  }

  function getItem(key: NlItemKeys | VrItemKeys | GmItemKeys): SidebarItem {
    const icon = mapKeysToIcons[key];

    return {
      key,
      title: siteText.sidebar[layout][key].title,
      icon,
      href: getHref(key),
    };
  }

  function getCategory(category: SidebarElement<C, I>): SidebarCategory {
    const [key, items] = category;

    return {
      key,
      title: siteText.sidebar[layout][key].title,
      items: items.map(getItem),
    };
  }

  const expandMap = (map: SidebarMap) =>
    map.map((x) => (typeof x === 'string' ? getItem(x) : getCategory(x)));

  return useMemo(() => expandMap(map), [layout]);
}
