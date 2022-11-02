import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { localeStringValidation } from '../../language/locale-validation';

import { SeverityLevels } from '@corona-dashboard/app/src/components/severity-indicator-tile/types';

const REQUIRED = (rule: Rule) => rule.required();
const REQUIRED_MIN_MAX = (rule: Rule, min: number, max: number) =>
  rule.required().min(min).max(max);

const SEVERITY_LEVELS = Object.values(SeverityLevels).map((severityLevel) =>
  parseInt(severityLevel, 10)
);

const THERMOMETER_MIN_VALUE = Math.min(...SEVERITY_LEVELS);
const THERMOMETER_MAX_VALUE = Math.max(...SEVERITY_LEVELS);

const DATE_FORMAT = 'YYYY-MM-DD';

export const thermometerEvent = {
  name: 'thermometerEvent',
  type: 'object',
  title: 'Thermometer Event',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) =>
        rule
          .required()
          .max(60)
          .error('Titels zijn gelimiteerd tot maximaal 60 tekens')
      ),
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeText',
      validation: REQUIRED,
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Level',
      name: 'level',
      type: 'number',
      validation: (rule: Rule) =>
        REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Datum',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: REQUIRED,
    },
    {
      title: 'Einddatum (optioneel)',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'date',
      dateEnd: 'dateEnd',
    },
    prepare(x: { title: string; date: string; dateEnd?: string }) {
      return {
        title: x.title,
        subtitle: [x.date, x.dateEnd].filter(isDefined).join(' tot '),
      };
    },
  },
};
