import { Gm, Nl } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LinkGroupProps } from './link-group';

export function useDataSitemap(base: 'nl' | 'gm', code?: string, data?: Pick<Nl, 'sewer'> | Pick<Gm, 'sewer'>): LinkGroupProps[] {
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();

  if (base === 'gm' && code) {
    return [
      {
        header: commonTexts.sidebar.categories.infections.title,
        links: [
          {
            text: commonTexts.sidebar.metrics.positive_tests.title,
            href: reverseRouter.gm.positiefGetesteMensen(code),
          },
          {
            text: commonTexts.sidebar.metrics.mortality.title,
            href: reverseRouter.gm.sterfte(code),
          },
        ],
      },
      {
        header: commonTexts.sidebar.categories.hospitals.title,
        links: [
          {
            text: commonTexts.sidebar.metrics.hospital_admissions.title,
            href: reverseRouter.gm.ziekenhuisopnames(code),
          },
        ],
      },
      {
        header: commonTexts.sidebar.categories.early_indicators.title,
        links: [
          {
            text: commonTexts.sidebar.metrics.sewage_measurement.title,
            href: data?.sewer ? reverseRouter.gm.rioolwater(code) : undefined,
          },
        ],
      },
    ];
  }

  return [
    {
      header: commonTexts.sidebar.categories.vaccinations.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.vaccinations.title,
          href: reverseRouter.nl.vaccinaties(),
        },
      ],
    },
    {
      header: commonTexts.sidebar.categories.infections.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.positive_tests.title,
          href: reverseRouter.nl.positiefGetesteMensen(),
        },
        {
          text: commonTexts.sidebar.metrics.reproduction_number.title,
          href: reverseRouter.nl.reproductiegetal(),
        },
        {
          text: commonTexts.sidebar.metrics.mortality.title,
          href: reverseRouter.nl.sterfte(),
        },
        {
          text: commonTexts.sidebar.metrics.variants.title,
          href: reverseRouter.nl.varianten(),
        },
      ],
    },
    {
      header: commonTexts.sidebar.categories.behaviour.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.compliance.title,
          href: reverseRouter.nl.gedrag(),
        },
      ],
    },
    {
      header: commonTexts.sidebar.categories.vulnerable_groups.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.nursing_home_care.title,
          href: reverseRouter.nl.kwetsbareGroepen(),
        },
        {
          text: commonTexts.sidebar.metrics.disabled_care.title,
          href: reverseRouter.nl.gehandicaptenzorg(),
        },
        {
          text: commonTexts.sidebar.metrics.elderly_at_home.title,
          href: reverseRouter.nl.thuiswonendeOuderen(),
        },
      ],
    },
    {
      header: commonTexts.sidebar.categories.early_indicators.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.sewage_measurement.title,
          href: reverseRouter.nl.rioolwater(),
        },
      ],
    },
    {
      header: commonTexts.sidebar.categories.archived_metrics.title,
      links: [
        {
          text: commonTexts.sidebar.metrics.infectious_people.title,
          href: reverseRouter.nl.besmettelijkeMensen(),
        },
        {
          text: commonTexts.sidebar.metrics.general_practitioner_suspicions.title,
          href: reverseRouter.nl.verdenkingenHuisartsen(),
        },
        {
          text: commonTexts.sidebar.metrics.coronamelder_app.title,
          href: reverseRouter.nl.coronamelder(),
        },
      ],
    },
  ];
}
