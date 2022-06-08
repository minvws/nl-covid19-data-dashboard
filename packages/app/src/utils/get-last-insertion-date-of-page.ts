import { get } from 'lodash';
/**
 * This method gets the most recent insertion date from the metrics used in a page
 *
 */
 const getLastInsertionDatePerMetric = (data, metricProperty) => {
   switch (metricProperty) {
    case 'behavior':
      case 'behavior_annotations':
      case 'booster_shot_administered':
      case 'repeating_shot_administered':
      case 'booster_coverage':
      case 'code':
      case 'corona_melder_app_download':
      case 'corona_melder_app_warning':
      case 'deceased_cbs':
      case 'deceased_rivm':
      case 'deceased_rivm_per_age_group':
      case 'difference':
      case 'named_difference':
      case 'disability_care':
      case 'doctor':
      case 'elderly_at_home':
      case 'g_number':
      case 'hospital_lcps':
      case 'hospital_nice':
      case 'hospital_nice_per_age_group':
      case 'infectious_people':
      case 'intensive_care_lcps':
      case 'intensive_care_nice':
      case 'intensive_care_nice_per_age_group':
      case 'last_generated':
      case 'name':
      case 'nursing_home':
      case 'proto_name':
      case 'reproduction':
      case 'sewer':
      case 'tested_ggd':
      case 'tested_ggd_archived':
      case 'tested_overall':
      case 'tested_per_age_group':
      case 'vaccine_vaccinated_or_support':
      case 'vaccine_delivery_estimate':
      case 'vaccine_administered':
      case 'vaccine_administered_doctors':
      case 'vaccine_administered_ggd_ghor':
      case 'vaccine_administered_ggd':
      case 'vaccine_administered_hospitals_and_care_institutions':
      case 'vaccine_administered_total':
      case 'vaccine_administered_planned':
      case 'vaccine_stock':
      case 'vaccine_delivery_per_supplier':
      case 'vaccine_coverage_per_age_group':
      case 'vaccine_coverage_per_age_group_estimated':
      case 'last_generated':
      case 'proto_name':
      case 'name':
      case 'code':
      case 'tested_overall':
      case 'hospital_nice':
      case 'tested_ggd':
      case 'tested_ggd_archived':
      case 'nursing_home':
      case 'sewer':
      case 'sewer_per_installation':
      case 'difference':
      case 'deceased_rivm':
      case 'deceased_cbs':
      case 'elderly_at_home':
      case 'disability_care':
      case 'behavior':
      case 'tested_overall_sum':
      case 'hospital_nice_sum':
      case 'g_number':
      case 'situations':
      case 'vaccine_coverage_per_age_group':
      case 'booster_coverage':
      case 'last_generated':
      case 'proto_name':
      case 'name':
      case 'code':
      case 'tested_overall':
      case 'hospital_nice':
      case 'deceased_rivm':
      case 'difference':
      case 'static_values':
      case 'sewer':
      case 'vaccine_coverage_per_age_group':
      case 'booster_coverage':
       
       break;
   }

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
