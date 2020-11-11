import { useState } from 'react';
import { MultipleLineChartTile } from '~/components-styled/multiple-line-chart-tile';
import { Select } from '~/components-styled/select';
import { NationalBehaviorValue } from '~/types/data';
import siteText from '~/locale/index';
import {
  BehaviorTypeControlOption,
  BehaviorTypeControls,
} from './components/type-control';
import { isDefined } from 'ts-is-present';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { Value } from '~/components/lineChart/lineChartWithWeekTooltip';
import { BehaviorIdentifier, behaviorIdentifier } from './types';
import { MetadataProps } from '~/components-styled/metadata';
import { Box, Spacer } from '~/components-styled/base';

interface BehaviorLineChartTileProps {
  values: NationalBehaviorValue[];
  metadata: MetadataProps;
}

export function BehaviorLineChartTile({
  values,
  metadata,
}: BehaviorLineChartTileProps) {
  const [type, setType] = useState<BehaviorTypeControlOption>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');

  const behaviorIdentifierWithData = behaviorIdentifier
    .map((id) => {
      const label = siteText.gedrag_onderwerpen[id];
      const valueKey = `${id}_${type}` as keyof NationalBehaviorValue;

      /**
       * We'll only render behaviors with 2 or more values, otherwise it cannot
       * result in a "line" in our line-chart.
       */
      const hasEnoughData =
        values.flatMap((x) => x[valueKey]).filter(Boolean).length > 1;

      return hasEnoughData
        ? {
            id,
            label,
            valueKey,
            isEnabled: hasEnoughData,
          }
        : undefined;
    })
    .filter(isDefined);

  return (
    <MultipleLineChartTile
      disableTimeControls
      title={siteText.nl_gedrag.basisregels.title}
      timeframeInitialValue="all"
      description={
        <>
          <Box display="flex" justifyContent="start">
            <BehaviorTypeControls value={type} onChange={setType} />
          </Box>
          <p>{siteText.nl_gedrag.basisregels.intro[type]}</p>
          <Select
            value={currentId}
            onChange={setCurrentId}
            options={behaviorIdentifierWithData.map(({ id, label }) => ({
              value: id,
              label,
            }))}
          />
          <Spacer mb={3} />
        </>
      }
      values={behaviorIdentifierWithData.map(({ valueKey }) =>
        values
          .map((value) => {
            if (!(valueKey in value)) return undefined;

            return {
              date: value.week_start_unix,
              value: value[valueKey],

              week: {
                start: value.week_start_unix,
                end: value.week_end_unix,
              },
            } as Value;
          })
          .filter(isDefined)
      )}
      linesConfig={behaviorIdentifierWithData.map(({ id, label }) => ({
        color: id === currentId ? '#05A0ED' : '#E7E7E7',
        zIndex: id === currentId ? 1 : 0,

        /**
         *  @TODO
         * - tooltip content on hover aanpassen
         * - on hover blauew kleur zetten
         * - tooltip positie verbeteren
         * - tooltip content:
         *   | naleving: 78% - {regel} / zie slack
         * - tooltip max breedte?
         **/

        // enableMouseTracking: id === currentId,
        showInLegend: false,
        events: {
          click: () => setCurrentId(id),
        },
        // states: {
        //   inactive: {
        //     opacity: 1,
        //   },
        // },
      }))}
      metadata={metadata}
      formatTooltip={({ date, value, week }) =>
        `${formatDateFromSeconds(week.start)} - ${formatDateFromSeconds(
          week.end
        )} <strong>${value}%</strong>`
      }
      formatYAxis={(x) => `${x}%`}
    />
  );
}
