import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box, Spacer } from '~/components-styled/base';
import { Select } from '~/components-styled/select';
import { Tile } from '~/components-styled/tile';
import {
  SeriesConfig,
  TimeSeriesChart,
} from '~/components-styled/time-series-chart';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorTypeControl } from './components/behavior-type-control';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[] | RegionalBehaviorValue[];
  title: string;
  introduction: Record<BehaviorType, string>;
}

export function BehaviorLineChartTile2({
  title,
  introduction,
  values,
}: BehaviorLineChartTileProps) {
  const [type, setType] = useState<BehaviorType>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');

  const behaviorIdentifierWithData = useMemo(() => {
    return behaviorIdentifiers
      .map((id) => {
        const label = siteText.gedrag_onderwerpen[id];
        const valueKey = `${id}_${type}` as
          | keyof NationalBehaviorValue
          | keyof RegionalBehaviorValue;

        /**
         * We'll only render behaviors with 2 or more values, otherwise it cannot
         * result in a "line" in our line-chart.
         */
        const hasEnoughData =
          values.map((x: any) => x[valueKey]).filter(isPresent).length > 1;

        return hasEnoughData
          ? {
              id,
              label,
              valueKey,
              isEnabled: hasEnoughData,
            }
          : undefined;
      })
      .filter(isPresent);
  }, [siteText, values, type]);

  const seriesConfig = useMemo(() => {
    return behaviorIdentifierWithData.map<
      SeriesConfig<NationalBehaviorValue | RegionalBehaviorValue>
    >(
      (behaviorData) =>
        ({
          type: 'line',
          metricProperty: behaviorData.valueKey,
          label: behaviorData.label,
          color:
            currentId === behaviorData.id ? colors.data.primary : '#E7E7E7',
        } as any)
    );
  }, [behaviorIdentifierWithData, currentId]);

  return (
    <Tile>
      <Header>
        <Box mr={{ lg: '1em' }} mb={{ lg: '1em' }}>
          <Heading level={3}>{title}</Heading>
        </Box>
      </Header>

      <Box display="flex" justifyContent="start" mb={3}>
        <BehaviorTypeControl value={type} onChange={setType} />
      </Box>

      <Box
        display={{ lg: 'flex' }}
        alignItems="baseline"
        flexDirection={{ lg: 'row' }}
      >
        <Box flex="1" mr={{ lg: 2 }}>
          <p>{introduction[type]}</p>
        </Box>
        <Box flex="1" display="flex" justifyContent="flex-end" ml={{ lg: 2 }}>
          <Select
            value={currentId}
            onChange={setCurrentId}
            options={behaviorIdentifierWithData.map(({ id, label }) => ({
              value: id,
              label,
            }))}
          />
        </Box>
      </Box>

      <Spacer mb={3} />
      <ParentSize>
        {({ width }) => (
          <TimeSeriesChart
            title={'Gedragsregels'}
            width={width}
            values={values}
            ariaLabelledBy=""
            paddingLeft={40}
            seriesConfig={seriesConfig as any}
            dataOptions={{
              isPercentage: true,
              hideLegend: true,
              showOnlyNearestPoint: true,
            }}
            tickValues={[0, 25, 50, 75, 100]}
            formatTooltip={(data) => {
              return data.value[data.valueKey];
            }}
            showDateMarker
          />
        )}
      </ParentSize>
    </Tile>
  );
}

const Header = styled.header(
  css({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: ['column', null, null, 'row'],
  })
);
