import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityNavigationMap } from '~/components/choropleth/municipality-navigation-map';
import {
  createSelectMunicipalHandler,
  MunicipalitySelectionHandler,
} from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { MunicipalityProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { MunicipalityComboBox } from '~/domain/layout/components/municipality-combo-box';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Layout } from '~/domain/layout/layout';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { useIntl } from '~/intl';

const tooltipContent = (selectedHandler: MunicipalitySelectionHandler) => {
  return (context: MunicipalityProperties): ReactNode => {
    const onSelectMunicipal = (event: any) => {
      event.stopPropagation();
      selectedHandler(context.gmcode);
    };

    return (
      <TooltipContent title={context.gemnaam} onSelect={onSelectMunicipal} />
    );
  };
};

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Municipality = (props) => {
  const { siteText } = useIntl();
  const { lastGenerated } = props;

  const router = useRouter();
  const breakpoints = useBreakpoints();

  const goToMunicipal = createSelectMunicipalHandler(
    router,
    'positief-geteste-mensen',
    !breakpoints.md
  );

  return (
    <Layout {...siteText.gemeente_index.metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout lastGenerated={lastGenerated}>
        {!breakpoints.md && (
          <Box bg="white">
            <MunicipalityComboBox onSelect={goToMunicipal} />
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
              tooltipContent={tooltipContent(goToMunicipal)}
              onSelect={goToMunicipal}
            />
          </Box>
        </Box>
      </MunicipalityLayout>
    </Layout>
  );
};

export default Municipality;
