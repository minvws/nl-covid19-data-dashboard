import { get, last } from 'lodash';
/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */
 const getLastInsertionDatePerMetric = (data, metricProperty: String) => {
  let metricDate: number;
   switch (metricProperty) {
    case "booster_shot_administered":
    case "behavior":  
    case "corona_melder_app_download":
    case "corona_melder_app_warning":
    case "deceased_cbs":
    case "deceased_rivm":
    case "disability_care":
    case "doctor":
    case "elderly_at_home":
    case "g_number":
    case "hospital_lcps":
    case "hospital_nice":
    case "hospital_nice_sum":
    case "hospital_nice_per_age_group":
    case "infectious_people":
    case "intensive_care_lcps":
    case "intensive_care_nice":
    case "intensive_care_nice_per_age_group":
    case "nursing_home":
    case "repeating_shot_administered":
    case "reproduction":
    case "sewer":
    case "situations":
    case "tested_ggd":
    case "tested_ggd_archived":
    case "tested_overall":
    case "tested_overall_sum":
    case "tested_per_age_group":
    case "vaccine_administered":
    case "vaccine_administered_doctors":
    case "vaccine_administered_ggd":
    case "vaccine_administered_ggd_ghor":
    case "vaccine_administered_hospitals_and_care_institutions":
    case "vaccine_administered_planned":
    case "vaccine_administered_total":
    case "vaccine_coverage":
    case "vaccine_coverage_per_age_group_estimated":
    case "vaccine_delivery_estimate":
    case "vaccine_delivery_per_supplier":
    case "vaccine_stock":
    case "vaccine_vaccinated_or_support":
      // Has Last Value
      metricDate = data.last_value.date_of_insertion_unix
      break;

    case "behavior_annotations":
    case "booster_coverage":
    case "vaccine_coverage_per_age_group":
    case "vaccine_coverage_per_age_group_archived":
    case "deceased_rivm_per_age_group":
      // Has Values
      metricDate = last(data.values as array) .date_of_insertion_unix
      break;

    case 'behavior_per_age_group':
      // Has direct date_of_insertion_unix
      metricDate = data.date_of_insertion_unix
      break;
      
    case 'variants':
      // Has unique format
      break;

    case 'sewer_per_installation':
      // Has unique format
      break;
      
    case "named_difference":
    case "difference":
      // Has no date_of_insertion_unix
      break;
    default:
      console.log(`error in metric ${metricProperty}`)
   }

export function getLastInsertionDateOfPage(
  data: unknown,
  pageMetrics: string[]
) {
  return pageMetrics.reduce((lastDate, metricProperty) => {
    const metricOrUnixDate = get(data, metricProperty);

    let metricDate: number;

    if (typeof metricOrUnixDate === 'number') {
      metricDate = metricOrUnixDate;
    } else if (typeof metricOrUnixDate?.last_value?.date_of_insertion_unix !== 'undefined') {
      metricDate = metricOrUnixDate?.last_value?.date_of_insertion_unix;
    } else if (typeof metricOrUnixDate?.values !== 'undefined') {
      metricDate = metricOrUnixDate?.values.reduce((max: number, value: any) => value.date_of_insertion_unix > max ? value.date_of_insertion_unix : max, 0);
    } else {
      metricDate = 0;
    }
    
    return metricDate > lastDate ? metricDate : lastDate;
  }, 0);
}
