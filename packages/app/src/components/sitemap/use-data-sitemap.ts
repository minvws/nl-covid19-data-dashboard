import { Gm, Nl, Vr } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LinkGroupProps } from './link-group';

export function useDataSitemap(
  base: 'nl' | 'vr' | 'gm',
  code?: string,
  data?: Pick<Nl, 'sewer'> | Pick<Vr, 'sewer'> | Pick<Gm, 'sewer'>
): LinkGroupProps[] {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  if (base === 'gm' && code) {
    return [
      {
        header: siteText.sidebar.categories.infections.title,
        links: [
          {
            text: siteText.sidebar.metrics.positive_tests.title,
            href: reverseRouter.gm.positiefGetesteMensen(code),
          },
          {
            text: siteText.sidebar.metrics.mortality.title,
            href: reverseRouter.gm.sterfte(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.hospitals.title,
        links: [
          {
            text: siteText.sidebar.metrics.hospital_admissions.title,
            href: reverseRouter.gm.ziekenhuisopnames(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.early_indicators.title,
        links: [
          {
            text: siteText.sidebar.metrics.sewage_measurement.title,
            href: data?.sewer ? reverseRouter.gm.rioolwater(code) : undefined,
          },
        ],
      },
    ];
  }

  if (base === 'vr' && code) {
    return [
      {
        header: siteText.sidebar.categories.infections.title,
        links: [
          {
            text: siteText.sidebar.metrics.positive_tests.title,
            href: reverseRouter.vr.positiefGetesteMensen(code),
          },
          {
            text: siteText.sidebar.metrics.mortality.title,
            href: reverseRouter.vr.sterfte(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.hospitals.title,
        links: [
          {
            text: siteText.sidebar.metrics.hospital_admissions.title,
            href: reverseRouter.vr.ziekenhuisopnames(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.vulnerable_groups.title,
        links: [
          {
            text: siteText.sidebar.metrics.nursing_home_care.title,
            href: reverseRouter.vr.verpleeghuiszorg(code),
          },
          {
            text: siteText.sidebar.metrics.disabled_care.title,
            href: reverseRouter.vr.gehandicaptenzorg(code),
          },
          {
            text: siteText.sidebar.metrics.disabled_care.title,
            href: reverseRouter.vr.thuiswonendeOuderen(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.early_indicators.title,
        links: [
          {
            text: siteText.sidebar.metrics.sewage_measurement.title,
            href: reverseRouter.vr.rioolwater(code),
          },
        ],
      },
      {
        header: siteText.sidebar.categories.behaviour.title,
        links: [
          {
            text: siteText.sidebar.metrics.compliance.title,
            href: reverseRouter.vr.gedrag(code),
          },
        ],
      },
    ];
  }

  return [
    {
      header: siteText.sidebar.categories.vaccinations.title,
      links: [
        {
          text: siteText.sidebar.metrics.vaccinations.title,
          href: reverseRouter.nl.vaccinaties(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.hospitals.title,
      links: [
        {
          text: siteText.sidebar.metrics.hospital_admissions.title,
          href: reverseRouter.nl.ziekenhuisopnames(),
        },
        {
          text: siteText.sidebar.metrics.intensive_care_admissions.title,
          href: reverseRouter.nl.intensiveCareOpnames(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.infections.title,
      links: [
        {
          text: siteText.sidebar.metrics.positive_tests.title,
          href: reverseRouter.nl.positiefGetesteMensen(),
        },
        {
          text: siteText.sidebar.metrics.reproduction_number.title,
          href: reverseRouter.nl.reproductiegetal(),
        },
        {
          text: siteText.sidebar.metrics.mortality.title,
          href: reverseRouter.nl.sterfte(),
        },
        {
          text: siteText.sidebar.metrics.variants.title,
          href: reverseRouter.nl.varianten(),
        },
        {
          text: siteText.sidebar.metrics.source_investigation.title,
          href: reverseRouter.nl.brononderzoek(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.behaviour.title,
      links: [
        {
          text: siteText.sidebar.metrics.compliance.title,
          href: reverseRouter.nl.gedrag(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.vulnerable_groups.title,
      links: [
        {
          text: siteText.sidebar.metrics.nursing_home_care.title,
          href: reverseRouter.nl.verpleeghuiszorg(),
        },
        {
          text: siteText.sidebar.metrics.disabled_care.title,
          href: reverseRouter.nl.gehandicaptenzorg(),
        },
        {
          text: siteText.sidebar.metrics.elderly_at_home.title,
          href: reverseRouter.nl.thuiswonendeOuderen(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.early_indicators.title,
      links: [
        {
          text: siteText.sidebar.metrics.sewage_measurement.title,
          href: reverseRouter.nl.rioolwater(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.other.title,
      links: [
        {
          text: siteText.sidebar.metrics.coronamelder_app.title,
          href: reverseRouter.nl.coronamelder(),
        },
      ],
    },
    {
      header: siteText.sidebar.categories.archived_metrics.title,
      links: [
        {
          text: siteText.sidebar.metrics.infectious_people.title,
          href: reverseRouter.nl.besmettelijkeMensen(),
        },
        {
          text: siteText.sidebar.metrics.general_practitioner_suspicions.title,
          href: reverseRouter.nl.verdenkingenHuisartsen(),
        },
      ],
    },
  ];
}
