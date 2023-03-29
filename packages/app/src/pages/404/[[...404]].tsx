import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { GetStaticPaths } from 'next/types';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { SanityImage } from '~/components/cms/sanity-image';
import DynamicIcon, { IconName } from '~/components/get-icon-by-name';
import { Header } from '~/components/page-information-block/components/header';
import { Anchor } from '~/components/typography';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { getClient, getImageProps } from '~/lib/sanity';
import { getNotFoundPageQuery } from '~/queries/get-not-found-page-query';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, sizes, space } from '~/style/theme';
import { ImageBlock } from '~/types/cms';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps = (async (context) => {
  const { lastGenerated } = getLastGeneratedDate();
  const { params: notFoundParams , locale } = context;
  
  const pageType = notFoundParams['404'][0]; // The pageType param is always the first param as it is the only one passed in.
  const query = getNotFoundPageQuery(locale, pageType)

  const client = await getClient();
  const notFoundPageConfiguration = await client.fetch(query);
  notFoundPageConfiguration.isGM = pageType === 'gm';

  return {
    props: { lastGenerated, notFoundPageConfiguration },
  }
})

type Link = {
  id: string;
  linkUrl: string;
  linkLabel: string;
  linkIcon?: string;
}

interface NotFoundProps {
  lastGenerated: string;
  notFoundPageConfiguration: {
    title: string;
    description: PortableTextEntry[];
    isGM: boolean;
    image: ImageBlock;
    links?: Link[];
    cta?: {
      ctaLabel: string;
      ctaLink: string;
      ctaIcon?: string;
    }
  }
}

const NotFound = (props: NotFoundProps) => {
  const { lastGenerated, notFoundPageConfiguration } = props;
  const { commonTexts } = useIntl();
  const { title, description, isGM, image, links = undefined, cta = undefined } = notFoundPageConfiguration;
  console.log('description :', description);

  return (
    <Layout {...commonTexts.notfound_metadata} lastGenerated={lastGenerated}>
      <NotFoundLayout>
        <Box>
          <Header title={title} />
          <RichContent blocks={description} elementAlignment="start" />

          {isGM && <GmComboBox selectedGmCode=""/>}

          {links && links.map((link, index) => (
            <NotFoundLink key={link.id} link={link} marginBottom={index !== links.length -1 ? space[2] : undefined} />
          ))}

          {cta && <Anchor href={cta.ctaLink} role="button">{cta.ctaLabel}</Anchor>}
        </Box>

        <Box display="flex" justifyContent="end" paddingRight={space[6]}>
          <SanityImage {...getImageProps(image, {})} />
        </Box>
      </NotFoundLayout>
    </Layout>
  );
}

export default NotFound;

interface NotFoundLinkProps {
  link: Link;
  marginBottom: string | undefined;
}

const NotFoundLink = ({link: {linkUrl, linkLabel, linkIcon}, marginBottom}: NotFoundLinkProps) => {
  const iconNameFromFileName = linkIcon ? getFilenameToIconName(linkIcon) as IconName : null;
  const icon = iconNameFromFileName ? <DynamicIcon color={colors.blue8} name={iconNameFromFileName} height="30px" width="30px" /> : undefined;

  return (
    <Box display="flex" alignItems="center" marginBottom={marginBottom}>
      {icon}
      <StyledAnchor href={linkUrl} underline>{linkLabel}</StyledAnchor>
      <ChevronRight color={colors.blue8} height="10px" />
    </Box>
  );
}

const NotFoundLayout = styled.div`
  max-width: ${sizes.maxWidth}px;
  margin: ${space[5]} auto;
  padding: 0 ${space[4]};
  display: grid;
  grid-template-columns: 30% 70%;
  grid-gap: ${space[5]};
`;

const StyledAnchor = styled(Anchor)`
  margin: 0 ${space[1]} 0 ${space[2]};

  &:hover {
    text-decoration: none;
  }
`;