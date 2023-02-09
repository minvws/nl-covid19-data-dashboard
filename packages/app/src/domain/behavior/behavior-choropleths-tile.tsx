import { colors, VrCollectionBehaviorArchived_20221019 } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { isNumber } from 'lodash';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { ErrorBoundary } from '~/components/error-boundary';
import { Heading, Text } from '~/components/typography';
import { VrBehaviorTooltip } from '~/domain/behavior/tooltip/vr-behavior-tooltip';
import { SiteText } from '~/locale';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier, behaviorIdentifiers } from './logic/behavior-types';

interface BehaviorChoroplethsTileProps {
  title: string;
  description: string;
  data: { behavior_archived_20221019: VrCollectionBehaviorArchived_20221019[] };
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  text: SiteText['pages']['behavior_page'];
}

export function BehaviorChoroplethsTile({ title, description, data, currentId, setCurrentId, text }: BehaviorChoroplethsTileProps) {
  const breakpoints = useBreakpoints();

  const keysWithoutData = useMemo(() => {
    const firstRegionData = data.behavior_archived_20221019[0];

    // Find all the keys that don't exist on VR level but do on NL
    const keysWithoutData = behaviorIdentifiers.filter((item) => !Object.keys(firstRegionData).find((a) => a.includes(item)));

    const keysThatAreAllNull = behaviorIdentifiers.filter((key) => {
      return data.behavior_archived_20221019.every((region) => {
        return (
          region[`${key}_compliance` as keyof VrCollectionBehaviorArchived_20221019] === null && region[`${key}_support` as keyof VrCollectionBehaviorArchived_20221019] === null
        );
      });
    });

    keysWithoutData.push(...keysThatAreAllNull);

    return keysWithoutData;
  }, [data.behavior_archived_20221019]);

  return (
    <ChartTile title={title} description={description}>
      <Box spacing={4} height="100%">
        <Box width={breakpoints.lg ? '50%' : '100%'}>
          <SelectBehavior label={text.nl.select_behaviour_label} value={currentId} onChange={setCurrentId} />
        </Box>
        <Box display="flex" flexWrap="wrap" spacing={{ _: 4, md: 0 }}>
          <ChoroplethBlock
            title={text.nl.verdeling_in_nederland.compliance_title}
            data={data}
            behaviorType="compliance"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
            text={text}
          />

          <ChoroplethBlock
            title={text.nl.verdeling_in_nederland.support_title}
            data={data}
            behaviorType="support"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
            text={text}
          />
        </Box>
      </Box>
    </ChartTile>
  );
}

interface ChoroplethBlockProps {
  data: { behavior_archived_20221019: VrCollectionBehaviorArchived_20221019[] };
  keysWithoutData: BehaviorIdentifier[];
  behaviorType: 'compliance' | 'support';
  currentId: BehaviorIdentifier;
  title: string;
  text: SiteText['pages']['behavior_page'];
}

function ChoroplethBlock({ data, keysWithoutData, behaviorType, currentId, title, text }: ChoroplethBlockProps) {
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  const isSmallScreen = breakpoints.sm;
  const metricProperty = `${currentId}_${behaviorType}` as keyof VrCollectionBehaviorArchived_20221019;

  return (
    <Box width={{ _: '100%', lg: '50%' }} spacing={3}>
      <Heading level={5} as="h4" textAlign="center">
        {title}
      </Heading>

      <Box position="relative">
        {keysWithoutData.includes(currentId) && (
          <Box position="absolute" display="flex" alignItems="center" justifyContent="center" top="0" width="100%" height="100%" css={css({ zIndex: 9 })}>
            <Text textAlign="center" css={css({ maxWidth: '300px' })}>
              {text.nl.verdeling_in_nederland.geen_beschikbare_data}
            </Text>
          </Box>
        )}
        <ErrorBoundary>
          <DynamicChoropleth
            accessibility={{
              key: 'behavior_choropleths',
            }}
            map="vr"
            data={data.behavior_archived_20221019}
            dataConfig={{
              metricName: 'behavior_archived_20221019',
              metricProperty,
              noDataFillColor: colors.gray1,
            }}
            dataOptions={{
              getLink: reverseRouter.vr.gedrag,
            }}
            minHeight={!isSmallScreen ? 350 : 400}
            formatTooltip={(context) => {
              const currentComplianceValueKey = `${currentId}_compliance` as keyof VrCollectionBehaviorArchived_20221019;
              const currentSupportValueKey = `${currentId}_support` as keyof VrCollectionBehaviorArchived_20221019;

              // Return null when there is no data available to prevent breaking the application when using tab
              if (keysWithoutData.includes(currentId)) return null;

              const complianceValue = context.dataItem[currentComplianceValueKey];
              const supportValue = context.dataItem[currentSupportValueKey];

              return (
                <VrBehaviorTooltip
                  behaviorType={behaviorType}
                  context={context}
                  currentMetric={currentId}
                  currentComplianceValue={isNumber(complianceValue) ? complianceValue : null}
                  currentSupportValue={isNumber(supportValue) ? supportValue : null}
                  text={text}
                />
              );
            }}
          />
        </ErrorBoundary>
      </Box>
      <Box display="flex" justifyContent={{ _: 'center', lg: 'flex-start' }} maxWidth="300px">
        <ChoroplethLegenda thresholds={thresholds.vr[metricProperty]} title={text.shared.basisregels.header_percentage} />
      </Box>
    </Box>
  );
}
