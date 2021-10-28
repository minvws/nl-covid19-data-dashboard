import {
  colors,
  KeysOfType,
  VrCollectionBehavior,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { ErrorBoundary } from '~/components/error-boundary';
import { Heading, Text } from '~/components/typography';
import { VrBehaviorTooltip } from '~/domain/behavior/tooltip/vr-behavior-tooltip';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SelectBehavior } from './components/select-behavior';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from './logic/behavior-types';

interface BehaviorChoroplethsTileProps {
  title: string;
  description: string;
  data: { behavior: VrCollectionBehavior[] };
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
}

export function BehaviorChoroplethsTile({
  title,
  description,
  data,
  currentId,
  setCurrentId,
}: BehaviorChoroplethsTileProps) {
  const { siteText } = useIntl();

  const keysWithoutData = useMemo(() => {
    const firstRegionData = data.behavior[0];

    // Find all the keys that don't exist on VR level but do on NL
    const keysWithoutData = behaviorIdentifiers.filter(
      (item) => !Object.keys(firstRegionData).find((a) => a.includes(item))
    );

    const keysThatAreAllNull = behaviorIdentifiers.filter((key) => {
      return data.behavior.every((region) => {
        return (
          region[`${key}_compliance` as keyof VrCollectionBehavior] === null &&
          region[`${key}_support` as keyof VrCollectionBehavior] === null
        );
      });
    });

    keysWithoutData.push(...keysThatAreAllNull);

    return keysWithoutData;
  }, [data.behavior]);

  return (
    <ChartTile title={title} description={description}>
      <Box spacing={4} height="100%">
        <SelectBehavior value={currentId} onChange={setCurrentId} />
        <Box display="flex" flexWrap="wrap" spacing={{ _: 4, md: 0 }}>
          <ChoroplethBlock
            title={siteText.nl_gedrag.verdeling_in_nederland.compliance_title}
            data={data}
            behaviorType="compliance"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
          />

          <ChoroplethBlock
            title={siteText.nl_gedrag.verdeling_in_nederland.support_title}
            data={data}
            behaviorType="support"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
          />
        </Box>
      </Box>
    </ChartTile>
  );
}

interface ChoroplethBlockProps {
  data: { behavior: VrCollectionBehavior[] };
  keysWithoutData: BehaviorIdentifier[];
  behaviorType: 'compliance' | 'support';
  currentId: BehaviorIdentifier;
  title: string;
}

function ChoroplethBlock({
  data,
  keysWithoutData,
  behaviorType,
  currentId,
  title,
}: ChoroplethBlockProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  const isSmallScreen = breakpoints.sm;
  const metricProperty = `${currentId}_${behaviorType}` as const;

  return (
    <Box width={{ _: '100%', lg: '50%' }} spacing={3}>
      <Heading level={5} as="h4" textAlign="center">
        {title}
      </Heading>

      <Box position="relative">
        {keysWithoutData.includes(currentId) && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top={0}
            width="100%"
            height="100%"
            css={css({ zIndex: 9 })}
          >
            <Text textAlign="center" css={css({ maxWidth: '300px' })}>
              {siteText.nl_gedrag.verdeling_in_nederland.geen_beschikbare_data}
            </Text>
          </Box>
        )}
        <ErrorBoundary>
          <DynamicChoropleth
            accessibility={{
              key: 'behavior_choropleths',
            }}
            map="vr"
            data={data.behavior}
            dataConfig={{
              metricName: 'behavior',
              metricProperty: metricProperty as unknown as KeysOfType<
                VrCollectionBehavior,
                number | null | boolean | undefined,
                true
              >,
              noDataFillColor: colors.offWhite,
            }}
            dataOptions={{
              getLink: reverseRouter.vr.gedrag,
            }}
            minHeight={!isSmallScreen ? 350 : 400}
            formatTooltip={(context) => {
              const currentComplianceValue =
                `${currentId}_compliance` as keyof VrCollectionBehavior;
              const currentSupportValue =
                `${currentId}_support` as keyof VrCollectionBehavior;

              // Return null when there is no data available to prevent breaking the application when using tab
              if (keysWithoutData.includes(currentId)) return null;

              return (
                <VrBehaviorTooltip
                  behaviorType={behaviorType}
                  context={context}
                  currentMetric={currentId}
                  currentComplianceValue={
                    context.dataItem[currentComplianceValue] as number
                  }
                  currentSupportValue={
                    context.dataItem[currentSupportValue] as number
                  }
                />
              );
            }}
          />
        </ErrorBoundary>
      </Box>
      <Box
        display="flex"
        justifyContent={{ _: 'center', lg: 'flex-start' }}
        maxWidth={300}
      >
        <ChoroplethLegenda
          thresholds={thresholds.vr[metricProperty]}
          title={siteText.gedrag_common.basisregels.header_percentage}
        />
      </Box>
    </Box>
  );
}
