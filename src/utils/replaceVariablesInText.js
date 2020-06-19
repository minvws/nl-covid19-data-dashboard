const curlyBracketRegex = /\{\{(.+?)\}\}/g;

/**
 * Small utility that accepts a translation string with placeholders
 * for variabels. For example:
 * "An example placeholder string with {{type}} brackets"
 * Where everything between curly brackets is accepted as a placeholder
 * for a variable. The second argument is an object with keys representing
 * the string between curly brackets. In this case it would be:
 * { type: 'curly' }
 *
 * - If a specific variable is NOT given, it will replace it with an empty string.
 * - If no translation is given, an empty string will be returned.
 *
 * @param {string} translation - Translation string with curly brackets for variables.
 * @param {object} variables - An object with keys representing any variable available for replacement.
 */
const replaceVariablesInText = (translation, variables) => {
  if (!translation) return '';

  return translation.replace(curlyBracketRegex, (_string, variableName) => {
    if (!variables) return '';

    return variables[variableName.trim()] ?? '';
  });
};

export default replaceVariablesInText;
