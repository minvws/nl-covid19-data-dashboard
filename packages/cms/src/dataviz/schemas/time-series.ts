import { isDefined } from 'ts-is-present';

const scopes = [
  { title: 'Actueel', value: 'ac' },
  { title: 'Landelijk', value: 'nl' },
  { title: 'Veiligheidsregio', value: 'vr' },
  { title: 'Gemeente', value: 'gm' },
  { title: 'Europe', value: 'eu' },
] as const;

export const timeSeries = {
  name: 'timeSeries',
  type: 'document',
  title: 'Time Series',
  fields: [
    {
      title: 'Scope',
      name: 'scope',
      type: 'string',
      // readOnly: true,
      options: {
        list: scopes, // <-- predefined values
        layout: 'radio', // <-- defaults to 'dropdown'
      },
    },
    {
      title: 'Metric Name', // metric name
      name: 'metricName',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Metric Property', // metric name
      name: 'metricName',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
  ],
  preview: {
    select: {
      /**
       * The key field works probably a little better for the searching results
       * list, but the path field is cleaner when browsing texts because it
       * avoids a lot of string duplication.
       */
      title: 'key',
      subtitle: 'text.nl',
    },
  },
};

/**
 * A valid placeholder is considered to look like ``{{placeholderName}}``.
 * This validator looks for mistakes such as ``{placeHolderName}}`` or
 * ``{{placeHolderName}}}``.
 */
function validateTextPlaceholders(text = '') {
  const faultyVariables = [...(text.matchAll(/{+[^}]+}+/g) as any)]
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return;
    })
    .filter(isDefined);

  return faultyVariables.length > 0
    ? `De volgende variabelen zijn niet juist geformatteerd: ${faultyVariables
        .map((x) => `"${x}"`)
        .join(', ')}`
    : true;
}
