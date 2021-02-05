import css from '@styled-system/css';
import styled from 'styled-components';
import NederlandIcon from '~/assets/nederland.svg';
import ArrowIcon from '~/assets/arrow.svg';
import { TitleWithIcon } from '~/components-styled/aside/title-with-icon';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { InlineText, Text } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function DataSitemap() {
  const breakpoints = useBreakpoints(true);

  if (!breakpoints.md) {
    return null;
  }

  return (
    <Box>
      <TitleWithIcon
        level={2}
        title={siteText.nationaal_actueel.data_sitemap_titel}
        fontSize="1.25rem"
        icon={<NederlandIcon />}
      />
      <Box>
        <Box maxWidth={{ md: 'maxWidthText' }} mb={4}>
          <Text>{siteText.nationaal_actueel.data_sitemap_toelichting}</Text>
        </Box>
        <Box
          display="flex"
          justifyContent={{ lg: 'space-between' }}
          flexWrap={{ md: 'wrap', lg: 'nowrap' }}
        >
          <Box width={{ md: '25%', lg: 'auto' }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.vaccinaties}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/vaccinaties"
                text={siteText.vaccinaties.titel_sidebar}
              />
            </List>
          </Box>
          <Box width={{ md: '25%', lg: 'auto' }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.besmettingen}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/positief-geteste-mensen"
                text={siteText.positief_geteste_personen.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/besmettelijke-mensen"
                text={siteText.besmettelijke_personen.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/reproductiegetal"
                text={siteText.reproductiegetal.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/sterfte"
                text={siteText.sterfte.titel_sidebar}
              />
            </List>
          </Box>
          <Box width={{ md: '25%', lg: 'auto' }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.ziekenhuizen}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/ziekenhuis-opnames"
                text={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/intensive-care-opnames"
                text={siteText.ic_opnames_per_dag.titel_sidebar}
              />
            </List>
          </Box>
          <Box width={{ md: '25%', lg: 'auto' }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.kwetsbare_groepen}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/verpleeghuiszorg"
                text={siteText.verpleeghuis_besmette_locaties.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/gehandicaptenzorg"
                text={
                  siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                }
              />
              <SitemapItem
                href="/landelijk/thuiswonende-ouderen"
                text={siteText.thuiswonende_ouderen.titel_sidebar}
              />
            </List>
          </Box>
          <Box width={{ md: '25%', lg: 'auto' }} marginTop={{ md: 4, lg: 0 }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.vroege_signalen}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/rioolwater"
                text={siteText.rioolwater_metingen.titel_sidebar}
              />
              <SitemapItem
                href="/landelijk/verdenkingen-huisartsen"
                text={siteText.verdenkingen_huisartsen.titel_sidebar}
              />
            </List>
          </Box>
          <Box width={{ md: '25%', lg: 'auto' }} marginTop={{ md: 4, lg: 0 }}>
            <StyledHeader>
              {siteText.nationaal_layout.headings.gedrag}
            </StyledHeader>
            <List>
              <SitemapItem
                href="/landelijk/gedrag"
                text={siteText.nl_gedrag.sidebar.titel}
              />
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

type SitemapItemProps = {
  href: string;
  text: string;
};

function SitemapItem(props: SitemapItemProps) {
  const { href, text } = props;
  return (
    <Item>
      <LinkWithIcon
        href={href}
        icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
        iconPlacement="right"
        fontWeight="bold"
      >
        {text}
      </LinkWithIcon>
    </Item>
  );
}

const StyledHeader = styled(InlineText)(
  css({
    fontWeight: 'bold',
    display: 'block',
  })
);

const List = styled.ul(
  css({
    m: 0,
    p: 0,
  })
);

const Item = styled.li(
  css({
    listStyle: 'none',
    marginBottom: 2,
    ':last-of-type': {
      marginBottom: 0,
    },
  })
);
