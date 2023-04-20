import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { getImageProps } from '~/lib/sanity';
import { mediaQueries, radii, sizes, space } from '~/style/theme';
import { Box } from '../base/box';
import { RichContent } from '../cms/rich-content';
import { SanityImage } from '../cms/sanity-image';
import { Heading } from '../typography';
import { NotFoundLink } from './not-found-link';
import { NotFoundProps } from './types';

export const NotFoundPage = ({ lastGenerated, notFoundPageConfiguration }: NotFoundProps) => {
  const {
    commonTexts: { notfound_metadata },
  } = useIntl();
  const { title, description, isGmPage = true, isGeneralPage = false, image, links = undefined, cta = undefined } = notFoundPageConfiguration;

  return (
    <Layout {...notfound_metadata} lastGenerated={lastGenerated}>
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
