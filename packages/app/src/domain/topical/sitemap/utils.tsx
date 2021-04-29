import { useIntl } from '~/intl';
import { LinkGroupProps } from './link-group';
import { Municipal, National, Regionaal } from '@corona-dashboard/common';

export function useDataSitemap(
  base: 'landelijk' | 'veiligheidsregio' | 'gemeente',
  code?: string,
  data?: National | Regionaal | Municipal
): LinkGroupProps[] {
  const { siteText } = useIntl();

  if (base === 'gemeente' && code) {
    const baseUrl = `/${base}/${code}`;

    return [
      {
        header: siteText.nationaal_layout.headings.besmettingen,
        links: [
          {
            text: siteText.positief_geteste_personen.titel_sidebar,
            href: baseUrl + '/positief-geteste-mensen',
          },
          {
            text: siteText.sterfte.titel_sidebar,
            href: baseUrl + '/sterfte',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.ziekenhuizen,
        links: [
          {
            text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
            href: baseUrl + '/ziekenhuis-opnames',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.vroege_signalen,
        links: [
          {
            text: siteText.rioolwater_metingen.titel_sidebar,
            href: data?.sewer ? baseUrl + '/rioolwater' : undefined,
          },
        ],
      },
    ];
  }

  if (base === 'veiligheidsregio' && code) {
    const baseUrl = `/${base}/${code}`;

    return [
      {
        header: siteText.nationaal_layout.headings.besmettingen,
        links: [
          {
            text: siteText.positief_geteste_personen.titel_sidebar,
            href: baseUrl + '/positief-geteste-mensen',
          },
          {
            text: siteText.sterfte.titel_sidebar,
            href: baseUrl + '/sterfte',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.ziekenhuizen,
        links: [
          {
            text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
            href: baseUrl + '/ziekenhuis-opnames',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.kwetsbare_groepen,
        links: [
          {
            text: siteText.verpleeghuis_besmette_locaties.titel_sidebar,
            href: baseUrl + '/verpleeghuiszorg',
          },
          {
            text: siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar,
            href: baseUrl + '/gehandicaptenzorg',
          },
          {
            text: siteText.thuiswonende_ouderen.titel_sidebar,
            href: baseUrl + '/thuiswonende-ouderen',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.vroege_signalen,
        links: [
          {
            text: siteText.rioolwater_metingen.titel_sidebar,
            href: baseUrl + '/rioolwater',
          },
        ],
      },
      {
        header: siteText.nationaal_layout.headings.gedrag,
        links: [
          {
            text: siteText.nl_gedrag.sidebar.titel,
            href: baseUrl + '/gedrag',
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
          href: '/landelijk/vaccinaties',
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.besmettingen,
      links: [
        {
          text: siteText.positief_geteste_personen.titel_sidebar,
          href: '/landelijk/positief-geteste-mensen',
        },
        {
          text: siteText.besmettelijke_personen.titel_sidebar,
          href: '/landelijk/besmettelijke-mensen',
        },
        {
          text: siteText.reproductiegetal.titel_sidebar,
          href: '/landelijk/reproductiegetal',
        },
        {
          text: siteText.sterfte.titel_sidebar,
          href: '/landelijk/sterfte',
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.ziekenhuizen,
      links: [
        {
          text: siteText.ziekenhuisopnames_per_dag.titel_sidebar,
          href: '/landelijk/ziekenhuis-opnames',
        },
        {
          text: siteText.ic_opnames_per_dag.titel_sidebar,
          href: '/landelijk/intensive-care-opnames',
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.kwetsbare_groepen,
      links: [
        {
          text: siteText.verpleeghuis_besmette_locaties.titel_sidebar,
          href: '/landelijk/verpleeghuiszorg',
        },
        {
          text: siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar,
          href: '/landelijk/gehandicaptenzorg',
        },
        {
          text: siteText.thuiswonende_ouderen.titel_sidebar,
          href: '/landelijk/thuiswonende-ouderen',
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.vroege_signalen,
      links: [
        {
          text: siteText.rioolwater_metingen.titel_sidebar,
          href: '/landelijk/rioolwater',
        },
        {
          text: siteText.verdenkingen_huisartsen.titel_sidebar,
          href: '/landelijk/verdenkingen-huisartsen',
        },
      ],
    },
    {
      header: siteText.nationaal_layout.headings.gedrag,
      links: [
        {
          text: siteText.nl_gedrag.sidebar.titel,
          href: '/landelijk/gedrag',
        },
      ],
    },
  ];
}
