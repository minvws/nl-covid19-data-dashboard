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
        header: siteText.nationaal_layout.headings.besmettingen,
        links: [
          {
            text: siteText.positief_geteste_personen.titel_sidebar,
            href: reverseRouter.gm.positiefGetesteMensen(code),
          },
          {
            text: siteText.sterfte.titel_sidebar,
            href: reverseRouter.gm.sterfte(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.ziekenhuizen,
        links: [
          {
            text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
            href: reverseRouter.gm.ziekenhuisopnames(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.vroege_signalen,
        links: [
          {
            text: siteText.rioolwater_metingen.titel_sidebar,
            href: data?.sewer ? reverseRouter.gm.rioolwater(code) : undefined,
          },
        ],
      },
    ];
  }

  if (base === 'vr' && code) {
    return [
      {
        header: siteText.nationaal_layout.headings.besmettingen,
        links: [
          {
            text: siteText.positief_geteste_personen.titel_sidebar,
            href: reverseRouter.vr.positiefGetesteMensen(code),
          },
          {
            text: siteText.sterfte.titel_sidebar,
            href: reverseRouter.vr.sterfte(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.ziekenhuizen,
        links: [
          {
            text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
            href: reverseRouter.vr.ziekenhuisopnames(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.kwetsbare_groepen,
        links: [
          {
            text: siteText.verpleeghuis_besmette_locaties.titel_sidebar,
            href: reverseRouter.vr.verpleeghuiszorg(code),
          },
          {
            text: siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar,
            href: reverseRouter.vr.gehandicaptenzorg(code),
          },
          {
            text: siteText.thuiswonende_ouderen.titel_sidebar,
            href: reverseRouter.vr.thuiswonendeOuderen(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.vroege_signalen,
        links: [
          {
            text: siteText.rioolwater_metingen.titel_sidebar,
            href: reverseRouter.vr.rioolwater(code),
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.gedrag,
        links: [
          {
            text: siteText.nl_gedrag.sidebar.titel,
            href: reverseRouter.vr.gedrag(code),
          },
        ],
      },
    ];
  }

  return [
    {
      header: siteText.nationaal_layout.headings.vaccinaties,
      links: [
        {
          text: siteText.vaccinaties.titel_sidebar,
          href: reverseRouter.nl.vaccinaties(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.ziekenhuizen,
      links: [
        {
          text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
          href: reverseRouter.nl.ziekenhuisopnames(),
        },
        {
          text: siteText.ic_opnames_per_dag.titel_sidebar,
          href: reverseRouter.nl.intensiveCareOpnames(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.besmettingen,
      links: [
        {
          text: siteText.positief_geteste_personen.titel_sidebar,
          href: reverseRouter.nl.positiefGetesteMensen(),
        },
        {
          text: siteText.reproductiegetal.titel_sidebar,
          href: reverseRouter.nl.reproductiegetal(),
        },
        {
          text: siteText.sterfte.titel_sidebar,
          href: reverseRouter.nl.sterfte(),
        },
        {
          text: siteText.covid_varianten.titel_sidebar,
          href: reverseRouter.nl.varianten(),
        },
        {
          text: siteText.besmettelijke_personen.titel_sidebar,
          href: reverseRouter.nl.besmettelijkeMensen(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.gedrag,
      links: [
        {
          text: siteText.nl_gedrag.sidebar.titel,
          href: reverseRouter.nl.gedrag(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.kwetsbare_groepen,
      links: [
        {
          text: siteText.verpleeghuis_besmette_locaties.titel_sidebar,
          href: reverseRouter.nl.verpleeghuiszorg(),
        },
        {
          text: siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar,
          href: reverseRouter.nl.gehandicaptenzorg(),
        },
        {
          text: siteText.thuiswonende_ouderen.titel_sidebar,
          href: reverseRouter.nl.thuiswonendeOuderen(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.vroege_signalen,
      links: [
        {
          text: siteText.rioolwater_metingen.titel_sidebar,
          href: reverseRouter.nl.rioolwater(),
        },
        {
          text: siteText.verdenkingen_huisartsen.titel_sidebar,
          href: reverseRouter.nl.verdenkingenHuisartsen(),
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.overig,
      links: [
        {
          text: siteText.corona_melder_app.sidebar.titel,
          href: reverseRouter.nl.coronamelder(),
        },
      ],
    },
  ];
}
