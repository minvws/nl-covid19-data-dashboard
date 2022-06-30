import { get } from 'lodash';
/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */
 const getLastInsertionDatePerMetric = (data: any, metricProperty: String): number => {
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
    case 'one_variant':
    case 'one_sewer_installation':
    case 'one_variant':
      // Has Last Value
      return data.last_value.date_of_insertion_unix;
    case "behavior_annotations":
    case "booster_coverage":
    case "vaccine_coverage_per_age_group":
    case "vaccine_coverage_per_age_group_archived":
    case "deceased_rivm_per_age_group":
      // Has Values
      return data.values[data.values.length - 1].date_of_insertion_unix
    case 'behavior_per_age_group':
      // Has direct date_of_insertion_unix
      return data.date_of_insertion_unix
    case 'variants':
      // Has unique format
      return data.values.reduce((lastDate :number, variant: any) => {
        const metricDate = getLastInsertionDatePerMetric(variant, 'one_variant');
        return Math.max(metricDate, lastDate);
      }, 0);
    case 'sewer_per_installation':
      // Has unique format
      return data.values.reduce((lastDate :number, sewerInstallation: any) => {
        const metricDate = getLastInsertionDatePerMetric(sewerInstallation, 'one_sewer_installation');
        return Math.max(metricDate, lastDate);
      }, 0);
    case "named_difference":
    case "difference":
      // Has no date_of_insertion_unix
      break;
    default:
      console.log(`error in metric ${metricProperty}`)
   }
   return 0;
}

export function getLastInsertionDateOfPage(
  data: any,
  pageMetrics: string[]
) {
  return pageMetrics.reduce((lastDate, metricProperty) => {
    const metricInstance = get(data, metricProperty);
    const metricDate = getLastInsertionDatePerMetric(metricInstance, metricProperty);
    
    return Math.max(metricDate, lastDate);
  }, 0);
}
