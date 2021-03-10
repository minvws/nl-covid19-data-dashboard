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
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import {
  isLineOrAreaDefinition,
  SeriesConfig,
} from '../../components-styled/time-series-chart/logic';
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
  }, [values, type]);

  const seriesConfig: SeriesConfig<
    NationalBehaviorValue | RegionalBehaviorValue
  > = useMemo(() => {
    return behaviorIdentifierWithData
      .sort((x) => (x.id === currentId ? 1 : -1)) // sort selected as last so it will be rendered on top in the SVG
      .map((behaviorData) => ({
        type: 'line',
        metricProperty: behaviorData.valueKey as any,
        label: behaviorData.label,
        color: colors.data.primary,
        isFaded: currentId !== behaviorData.id,
      }));
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
            seriesConfig={seriesConfig}
            dataOptions={{
              isPercentage: true,
              disableLegend: true,
              markNearestPointOnly: true,
            }}
            tickValues={[0, 25, 50, 75, 100]}
            formatTooltip={(data) => {
              const cf = data.config
                .filter(isLineOrAreaDefinition)
                .find((x) => x.metricProperty === data.valueKey);
              return `${cf?.label} ${data.value[data.valueKey]}`;
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
