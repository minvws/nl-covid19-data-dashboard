import css from '@styled-system/css';
import styled from 'styled-components';
import Chevron from '~/assets/chevron.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { Tile } from '~/components-styled/tile';
import { InlineText, Text } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { Link } from '~/utils/link';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function DataSitemap() {
  const breakpoints = useBreakpoints(true);

  if (!breakpoints.md) {
    return null;
  }

  return (
    <Tile>
      <ContentHeader title={siteText.nationaal_actueel.data_sitemap_titel} />
      <Box ml={5}>
        <Box>
          <Text>{siteText.nationaal_actueel.data_sitemap_toelichting}</Text>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box spacing={2}>
              <StyledHeader>
                {siteText.nationaal_layout.headings.besmettingen}
              </StyledHeader>
              <DataSiteMapLink
                href="/landelijk/positief-geteste-mensen"
                text={siteText.positief_geteste_personen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/besmettelijke-mensen"
                text={siteText.besmettelijke_personen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/reproductiegetal"
                text={siteText.reproductiegetal.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/sterfte"
                text={siteText.sterfte.titel_sidebar}
              />
            </Box>
            <Box spacing={2}>
              <StyledHeader>
                {siteText.nationaal_layout.headings.ziekenhuizen}
              </StyledHeader>
              <DataSiteMapLink
                href="/landelijk/ziekenhuis-opnames"
                text={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/intensive-care-opnames"
                text={siteText.ic_opnames_per_dag.titel_sidebar}
              />
            </Box>
            <Box spacing={2}>
              <StyledHeader>
                {siteText.nationaal_layout.headings.kwetsbare_groepen}
              </StyledHeader>
              <DataSiteMapLink
                href="/landelijk/verpleeghuiszorg"
                text={siteText.verpleeghuis_besmette_locaties.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/gehandicaptenzorg"
                text={
                  siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                }
              />
              <DataSiteMapLink
                href="/landelijk/thuiswonende-ouderen"
                text={siteText.thuiswonende_ouderen.titel_sidebar}
              />
            </Box>
            <Box spacing={2}>
              <StyledHeader>
                {siteText.nationaal_layout.headings.vroege_signalen}
              </StyledHeader>
              <DataSiteMapLink
                href="/landelijk/rioolwater"
                text={siteText.rioolwater_metingen.titel_sidebar}
              />
              <DataSiteMapLink
                href="/landelijk/verdenkingen-huisartsen"
                text={siteText.verdenkingen_huisartsen.titel_sidebar}
              />
            </Box>
            <Box spacing={2}>
              <StyledHeader>
                {siteText.nationaal_layout.headings.gedrag}
              </StyledHeader>
              <DataSiteMapLink
                href="/landelijk/rioolwater"
                text={siteText.nl_gedrag.sidebar.titel}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Tile>
  );
}

type DataSiteMapLinkProps = {
  href: string;
  text: string;
};

function DataSiteMapLink(props: DataSiteMapLinkProps) {
  const { href, text } = props;
  return (
    <Link href={href}>
      <StyledLink>
        {text} <Chevron width="12px" height="12px" />
      </StyledLink>
    </Link>
  );
}

const StyledHeader = styled(InlineText)(
  css({
    fontWeight: 'bold',
    display: 'block',
  })
);

const StyledLink = styled.a(
  css({
    fontWeight: 'bold',
    display: 'block',
  })
);
