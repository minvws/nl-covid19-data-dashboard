import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { SanityImage } from '~/components/cms/sanity-image';
import DynamicIcon, { IconName } from '~/components/get-icon-by-name';
import { Anchor, Heading, Text } from '~/components/typography';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { Content } from '~/domain/layout/content';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { getClient, getImageProps } from '~/lib/sanity';
import { getNotFoundPageQuery } from '~/queries/get-not-found-page-query';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, radii, sizes, space } from '~/style/theme';
import { ImageBlock } from '~/types/cms';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';

const determinePageType = (url: string) => {
  const LevelsToPageTypeMapping: { [key: string]: string } = { landelijk: 'nl', gemeente: 'gm', artikelen: 'article' };

  let pageType = 'general';
  Object.keys(LevelsToPageTypeMapping).forEach((key) => {
    if (url.includes(`/${key}`)) {
      pageType = LevelsToPageTypeMapping[key];
    }
  });

  return pageType;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, locale = 'nl' }) => {
  res.statusCode = 404;
  const { lastGenerated } = getLastGeneratedDate();

  const pageType = req.url ? determinePageType(req.url) : 'general';
  const query = getNotFoundPageQuery(locale, pageType);
  const client = await getClient();
  const notFoundPageConfiguration = await client.fetch(query);

  if (notFoundPageConfiguration === null) {
    return { props: { lastGenerated } };
  }

  notFoundPageConfiguration.isGmPage = pageType === 'gm';
  notFoundPageConfiguration.isGeneralPage = pageType === 'general';

  return {
    props: { lastGenerated, notFoundPageConfiguration },
  };
};

type Link = {
  id?: string;
  linkIcon?: string;
  linkLabel: string;
  linkUrl: string;
};

interface NotFoundProps {
  lastGenerated: string;
  notFoundPageConfiguration: {
    description: PortableTextEntry[];
    image: ImageBlock;
    isGeneralPage: boolean;
    isGmPage: boolean;
    title: string;
    cta?: {
      ctaIcon?: string;
      ctaLabel: string;
      ctaLink: string;
    };
    links?: Link[];
  };
}

const NotFound = ({ lastGenerated, notFoundPageConfiguration }: NotFoundProps) => {
  const { commonTexts } = useIntl();

  if (!notFoundPageConfiguration || !Object.keys(notFoundPageConfiguration).length) {
    return (
      <Layout {...commonTexts.notfound_metadata} lastGenerated={lastGenerated}>
        <Content>
          <Heading level={1}>{commonTexts.notfound_titel.text}</Heading>
          <Text>{commonTexts.notfound_beschrijving.text}</Text>
        </Content>
      </Layout>
    );
  }

  const { title, description, isGmPage, isGeneralPage, image, links = undefined, cta = undefined } = notFoundPageConfiguration;

  return (
    <Layout {...commonTexts.notfound_metadata} lastGenerated={lastGenerated}>
      <NotFoundLayout>
        <Box minWidth="50%" display="flex" flexDirection="column">
          <Box spacing={4} marginBottom={space[4]} maxWidth="400px" order={1}>
            <Heading level={1}>{title}</Heading>
            <RichContent blocks={description} elementAlignment="start" />
          </Box>

          {isGmPage && (
            // Compensating for padding on the combo-box element using negative margins.
            <Box margin={`-${space[4]} -${space[3]} 0`} maxWidth="400px" order={2}>
              <GmComboBox selectedGmCode="" shouldFocusInput={false} />
            </Box>
          )}

          {links && (
            <Box order={isGeneralPage ? 3 : 4}>
              {links.map((link, index) => (
                <NotFoundLink
                  alignItems="center"
                  display="flex"
                  hasChevron
                  key={link.id}
                  link={link}
                  marginBottom={isGeneralPage ? (index === links.length - 1 ? space[4] : space[2]) : undefined}
                />
              ))}
            </Box>
          )}

          {cta && Object.values(cta).some((item) => item !== null) && (
            <NotFoundCTA
              alignItems="center"
              border={`1px solid ${colors.blue8}`}
              borderRadius={`${radii[1]}px`}
              className="not-found-content-cta"
              display="inline-flex"
              isCTA
              link={{ linkUrl: cta.ctaLink, linkLabel: cta.ctaLabel, linkIcon: cta.ctaIcon || '' }}
              marginBottom={isGeneralPage ? undefined : space[4]}
              maxWidth="fit-content"
              order={isGeneralPage ? 4 : 3}
              padding={`${space[1]} ${space[2]}`}
            />
          )}
        </Box>

        <Box display="flex" justifyContent={{ _: 'center', sm: 'flex-start' }} maxHeight="520px">
          <SanityImage {...getImageProps(image, {})} />
        </Box>
      </NotFoundLayout>
    </Layout>
  );
};

export default NotFound;

interface NotFoundLinkProps {
  alignItems: string;
  display: string;
  link: Link;
  border?: string;
  borderRadius?: string;
  className?: string;
  hasChevron?: boolean;
  isCTA?: boolean;
  marginBottom?: string;
  maxWidth?: string;
  order?: number;
  padding?: string;
}

const NotFoundLink = ({ link: { linkUrl, linkLabel, linkIcon }, hasChevron, isCTA, ...restProps }: NotFoundLinkProps) => {
  const iconNameFromFileName = linkIcon ? (getFilenameToIconName(linkIcon) as IconName) : null;
  const icon = iconNameFromFileName ? <DynamicIcon color={colors.blue8} name={iconNameFromFileName} height="30px" width="30px" /> : undefined;

  return (
    <Box {...restProps}>
      {icon && icon}

      <StyledAnchor hasIcon={!!icon} href={linkUrl} isCTA={isCTA} underline={!isCTA}>
        {linkLabel}
      </StyledAnchor>

      {hasChevron && <ChevronRight color={colors.blue8} height="10px" />}
    </Box>
  );
};

const NotFoundCTA = NotFoundLink; // Renaming for the sake of readability.

const NotFoundLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space[4]};
  justify-content: space-between;
  margin: ${space[5]} auto;
  max-width: ${sizes.maxWidth}px;
  padding: 0 ${space[3]};

  @media ${mediaQueries.sm} {
    flex-direction: row;
    padding: 0 ${space[4]};
  }

  @media ${mediaQueries.md} {
    align-items: flex-start;
  }

  .not-found-content-cta {
    transition: all 0.2s ease-in-out;

    svg rect {
      fill: ${colors.transparent};
    }

    &:hover {
      background-color: ${colors.gray1};
    }
  }
`;

interface StyledAnchorProps {
  hasIcon: boolean;
  isCTA: boolean | undefined;
}

const StyledAnchor = styled(Anchor)<StyledAnchorProps>`
  margin-inline: ${({ hasIcon, isCTA }) => (hasIcon || isCTA ? space[2] : !hasIcon ? `0 ${space[2]}` : 0)};

  &:hover {
    text-decoration: none;
  }
`;
