import { gmData, vrData } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
/**
 * This utility will return the required piece of text for the right GM that is defined in the export
 * Before returning, the function will check if the defined GM or VR is the same as the current metric page
 */
export function useScopedWarning(current: string, warning: string) {
  const { commonTexts } = useIntl();
  const scopedGmName = commonTexts.gemeente_index.municipality_warning;
  const scopedGm = gmData.find((gm) => gm.name === scopedGmName || (gm.searchTerms && gm.searchTerms.includes(scopedGmName)));
  const scopedVr = vrData.find((vr) => vr.code === scopedGm?.vrCode);

  // Check if defined GM is the same as current
  if (scopedGm?.name === current) {
    return replaceVariablesInText(warning, {
      municipality: scopedGm?.name,
    });
  }
  // Check if extracted VR from defined GM is the same as current VR
  if (scopedVr?.name === current) {
    return replaceVariablesInText(warning, {
      municipality: scopedGm?.name,
    });
  }
}
