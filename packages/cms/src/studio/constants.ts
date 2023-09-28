import { MetricName } from '@corona-dashboard/common';
import { Bs1Circle, Bs2Circle, Bs3Circle, Bs4Circle } from 'react-icons/bs';

// By mapping the metric name to a title we can make the UI a little more user-friendly.
export const titleByMetricName: Partial<Record<MetricName, string>> = {
  behavior_annotations_archived_20230412: 'Gedrag - Annotaties',
  behavior_archived_20230411: 'Gedrag (archief per 19-10-2022)',
  behavior_per_age_group_archived_20230411: 'Gedrag (per leeftijd)',
  booster_coverage_archived_20220904: 'Vaccinatiegraad (booster) (archief per 04-09-2022)',
  booster_shot_administered_archived_20220904: 'Gezette prikken (booster) (archief per 04-09-2022)',
  corona_melder_app_download_archived_20220421: 'Coronamelder - Downloads',
  corona_melder_app_warning_archived_20220421: 'Coronamelder - Waarschuwingen door de tijd heen',
  deceased_cbs: 'Sterfte (CBS)',
  deceased_rivm_archived_20221231: 'Sterfte (RIVM)',
  deceased_rivm_per_age_group_archived_20221231: 'Sterfte (per leeftijd) (RIVM) (archief per 31-12-2022)',
  difference: 'Verschil',
  disability_care_archived_20230126: 'Gehandicaptenzorg',
  doctor_archived_20210903: 'Huisartsen',
  elderly_at_home_archived_20230126: '70-plussers',
  g_number_archived_20220607: 'Ontwikkeling aantal positieve testen',
  hospital_lcps: 'Ziekenhuisopnames (LCPS)',
  hospital_nice_per_age_group: 'Ziekenhuisopnames (per leeftijd) (NICE)',
  hospital_nice: 'Ziekenhuisopnames (NICE)',
  infectious_people_archived_20210709: 'Besmettelijke mensen',
  intensive_care_lcps: 'IC-opnames (LCPS)',
  intensive_care_nice_per_age_group: 'IC-opnames (per leeftijd) (NICE)',
  intensive_care_nice: 'IC-opnames (NICE)',
  named_difference: 'Verschil',
  nursing_home_archived_20230126: 'Verpleeghuizen',
  repeating_shot_administered_20220713: 'Gezette herhaalprikken',
  reproduction_archived_20230711: 'Reproductiegetal',
  self_test_overall: 'Zelfgerapporteerde positieve coronatestuitslagen',
  sewer_per_installation: 'Virusdeeltjes in rioolwater',
  sewer: 'Rioolwater metingen',
  static_values: 'Statische waarden',
  tested_ggd_archived_20230321: "Positief geteste mensen (GGD'en)",
  tested_overall_archived_20230331: 'Positief geteste mensen',
  tested_per_age_group_archived_20230331: 'Positief getest (per leeftijd)',
  vaccine_administered_doctors_archived_20220324: 'Gezette prikken (huisartsen)',
  vaccine_administered_ggd_ghor_archived_20220324: "Gezette prikken (GGD'en)",
  vaccine_administered_ggd_archived_20220324: "Gezette prikken (GGD'en)",
  vaccine_administered_hospitals_and_care_institutions_archived_20220324: 'Gezette prikken in instellingen (inclusief ziekenhuizen)',
  vaccine_administered_planned_archived_20220518: 'Gepland aantal te zetten prikken',
  vaccine_administered_total_archived_20220324: 'Totaal aantal gezette prikken',
  vaccine_administered_archived_20220914: 'Gezette prikken',
  vaccine_campaigns_archived_20220908: 'Vaccinatie campagnes (archief per 08-09-2022)',
  vaccine_campaigns: 'Vaccinatie campagnes',
  vaccine_coverage_per_age_group_archived_20220908: 'Vaccinatiegraad (per leeftijd) (archief per 08-09-2022)',
  vaccine_coverage_per_age_group_archived_20220622: 'Vaccinatiegraad (per leeftijd) (archief)',
  vaccine_coverage_per_age_group_estimated_archived_20220908: 'Vaccinatiegraad berekend (per leeftijd) (archief 08-09-2022)',
  vaccine_coverage_per_age_group_estimated_autumn_2022_archived_20231004: 'Vaccinatiegraad herfst 2022 booster berekend (per leeftijd)',
  vaccine_coverage_per_age_group_estimated_fully_vaccinated_archived_20231004: 'Vaccinatiegraad basisserie berekend (per leeftijd)',
  vaccine_coverage_per_age_group_archived_20231004: 'Vaccinatiegraad (per leeftijd)',
  vaccine_coverage_archived_20220518: 'Vaccinatiegraad',
  vaccine_delivery_per_supplier_archived_20211101: 'Vaccinleveringen per leverancier',
  vaccine_planned_archived_20220908: 'Geplande prikken (archief per 09-08-2022)',
  vaccine_stock_archived_20211024: 'Vaccinvoorraad',
  vaccine_vaccinated_or_support_archived_20230411: 'Vaccinatiebereidheid of reeds gevaccineerd',
  variants: 'Varianten van het virus',
  vulnerable_hospital_admissions_archived_20230711: 'Kwetsbare groepen - Ziekenhuisopnames',
  vulnerable_nursing_home_archived_20230711: 'Kwetsbare groepen - Verpleeg- en verzorgingshuizen',
};

// By mapping the element type to a title we can make the UI a little more user-friendly.
export const titleByElementType: Record<string, string> = {
  timeSeries: 'Grafiek',
};

export const SEVERITY_LEVELS_LIST = [1, 2, 3, 4];
export const thermometerLevelPreviewMedia = [Bs1Circle, Bs2Circle, Bs3Circle, Bs4Circle];

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DAYS_OF_THE_WEEK_LIST = [
  {
    title: 'Zondag',
    value: 0,
  },
  {
    title: 'Maandag',
    value: 1,
  },
  {
    title: 'Dinsdag',
    value: 2,
  },
  {
    title: 'Woensdag',
    value: 3,
  },
  {
    title: 'Donderdag',
    value: 4,
  },
  {
    title: 'Vrijdag',
    value: 5,
  },
  {
    title: 'Zaterdag',
    value: 6,
  },
];

export const RELATIVE_SCHEMA_PATH = '../../../../app/schema';
