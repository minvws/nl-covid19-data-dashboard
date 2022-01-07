import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
/**
 * This utility will return the required piece of text for the right GM that is defined in the export
 * Before returning, the function will check if the defined GM or VR is the same as the current metric page
 */
export function getScopedGmWarning(
  scopedGm: string,
  current: string,
  warning: string,
  scopedVr?: string
) {
  // Check if defined GM is the same as current
  if (scopedGm === current) {
    return replaceVariablesInText(warning, {
      municipality: scopedGm,
    });
  }
  // Check if extracted VR from defined GM is the same as current VR
  if (scopedVr === current) {
    return replaceVariablesInText(warning, {
      municipality: scopedGm,
    });
  }
}
