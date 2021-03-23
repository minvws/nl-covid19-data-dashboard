import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityNavigationMap } from '~/components/choropleth/municipality-navigation-map';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { MunicipalityComboBox } from '~/domain/layout/components/municipality-combo-box';
import { Layout } from '~/domain/layout/layout';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  const breakpoints = useBreakpoints();

  const metadata = {
    ...siteText.gemeente_index.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout isLandingPage lastGenerated={lastGenerated}>
        {!breakpoints.md && (
          <Box bg="white">
            <MunicipalityComboBox />
          </Box>
        )}

        <Box as="article" p={4}>
          <Heading level={3} as="h1">
            {siteText.gemeente_index.selecteer_titel}
          </Heading>
          <Text>{siteText.gemeente_index.selecteer_toelichting}</Text>

          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            height="120vw"
            maxWidth={750}
            maxHeight={960}
            margin="0 auto"
          >
            <MunicipalityNavigationMap
              tooltipContent={(context) => (
                <TooltipContent
                  title={context.gemnaam}
                  link={reverseRouter.gm.index(context.gmcode)}
                />
              )}
            />
          </Box>
        </Box>
      </MunicipalityLayout>
    </Layout>
  );
};

export default Municipality;
