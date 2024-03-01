import _ from 'lodash';
import { Box } from '~/components/base';
import { CollapsibleSection } from '~/components';
import { colors, gmData, MunicipalityInfo } from '@corona-dashboard/common';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { GmLayout, Layout } from '~/domain/layout';
import { Heading } from '~/components/typography';
import { Link } from '~/utils/link';
import { Map } from '@corona-dashboard/icons';
import { Menu, MenuItemLink } from '~/components/aside/menu';
import { radii, space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import styled from 'styled-components';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

enum MunicipalityLetter {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  G = 'G',
  H = 'H',
  I = 'I',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  Z = 'Z',
}

const MunicipalityListOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const sortedGmData = _.sortBy<MunicipalityInfo>(gmData, [(municipality) => (municipality.displayName ? municipality.displayName : municipality.name)]);
  const groupedGmData = _.groupBy<MunicipalityInfo>(
    sortedGmData,
    (municipality) => (municipality.displayName ? municipality.displayName : municipality.name)[0].toUpperCase() as MunicipalityLetter
  );

  const code = router.query.code as string;

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout
        asideComponent={
          <Box width="100%">
            <Box maxWidth={{ _: '38rem', md: undefined }}>
              <Menu>
                <MenuItemLink icon={<Map />} title={commonTexts.gemeente_layout.list.go_to_map_label} href={reverseRouter.gm.index()} showArrow isLinkForMainMenu={false} />
              </Menu>
            </Box>
          </Box>
        }
        isLandingPage
        code={code}
      >
        <Box padding={space[3]}>
          <Heading level={2}>{commonTexts.gemeente_layout.list.list_label}</Heading>
          <Box paddingY={space[3]} display="flex" flexDirection="row" flexWrap={'wrap'} alignItems="stretch" justifyContent="left">
            {Object.entries(MunicipalityLetter).map(([letterKey, letterValue], index) => (
              <Fragment key={index + letterKey}>
                <StyledLetter textAlign="center">
                  <Link href={`#${letterValue}`} passHref>
                    {letterValue}
                  </Link>
                </StyledLetter>
              </Fragment>
            ))}
          </Box>

          <>
            {Object.entries(MunicipalityLetter).map(([letterKey, letterValue], index) => (
              <Box marginY={space[3]} key={index + letterKey + letterValue}>
                {!breakpoints.sm ? (
                  <StyledCollapsibleSection id={letterValue} summary={letterValue}>
                    <Box marginBottom={space[3]}>
                      {groupedGmData[letterKey].map((item, index) => (
                        <Box display="flex" marginBottom={space[1]} key={item.name + index}>
                          <StyledAnchor>
                            <Link href={reverseRouter.gm.rioolwater(item.gemcode as string)} key={index + item.name}>
                              {item.name}
                            </Link>
                          </StyledAnchor>
                        </Box>
                      ))}
                    </Box>
                  </StyledCollapsibleSection>
                ) : (
                  <Box marginY={space[4]}>
                    <Heading level={2} id={letterValue} marginBottom={space[2]}>
                      {letterValue}
                    </Heading>

                    <ColumnContainer paddingY={space[2]}>
                      {groupedGmData[letterKey].map((item, index) => (
                        <ColumnItem marginBottom={space[1]} key={item.name + index}>
                          <StyledAnchor>
                            <Link href={reverseRouter.gm.rioolwater(item.gemcode as string)} key={index + item.name}>
                              {item.displayName ? item.displayName : item.name}
                            </Link>
                          </StyledAnchor>
                        </ColumnItem>
                      ))}
                    </ColumnContainer>
                  </Box>
                )}
              </Box>
            ))}
          </>
        </Box>
      </GmLayout>
    </Layout>
  );
};

export default MunicipalityListOverview;

const StyledLetter = styled(Box)`
  text-decoration: underline;

  width: 24px;
  height: 24px;

  a {
    color: black;
  }
`;

const StyledCollapsibleSection = styled(CollapsibleSection)`
  border: 1px solid ${colors.blue8};
  border-radius: ${radii[1]}px;
  color: black;
`;

const StyledAnchor = styled(Box)`
  text-decoration: underline;
  text-decoration-color: ${colors.blue8};
`;

const ColumnContainer = styled(Box)`
  column-count: 4;
  column-gap: 20px;
  width: 100%;
`;
const ColumnItem = styled(Box)`
  break-inside: avoid-column;
  page-break-inside: avoid;
  padding: ${space[1]} 0;
`;
