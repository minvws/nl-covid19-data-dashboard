import { NationalBehaviorValue, RegionalBehaviorValue } from '~/types/data';
import { PercentageBar } from '../percentage-bar';
import { Tile } from '../layout';
import { ReactNode, useState } from 'react';
import { formatPercentage } from '~/utils/formatNumber';
import { BehaviorTypeControls } from '../behavior-type-controls';

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

type BehaviorIdentifier =
  | 'wash_hands'
  | 'keep_distance'
  | 'work_from_home'
  | 'avoid_crowds'
  | 'symptoms_stay_home'
  | 'symptoms_get_tested'
  | 'wear_mask_public_indoors'
  | 'wear_mask_public_transport'
  | 'sneeze_cough_elbow'
  | 'max_visitors';

const behaviorIdentifiers: BehaviorIdentifier[] = [
  'wash_hands',
  'keep_distance',
  'work_from_home',
  'avoid_crowds',
  'symptoms_stay_home',
  'symptoms_get_tested',
  'wear_mask_public_indoors',
  'wear_mask_public_transport',
  'sneeze_cough_elbow',
  'max_visitors',
];

interface BehaviorTileProps {
  behavior: BehaviorValue;
  children: ReactNode;
}

interface Behavior {
  id: string;
  icon: string;
  description: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'equal';
}

function formatBehaviorType(
  behavior: BehaviorValue,
  type: 'compliance' | 'support'
): Behavior[] {
  return behaviorIdentifiers.map((identifier) => {
    const percentage = behavior[
      `${identifier}_${type}` as keyof BehaviorValue
    ] as number | undefined;
    const trend = behavior[
      `${identifier}_${type}_trend` as keyof BehaviorValue
    ] as Behavior['trend'] | undefined;

    return {
      id: identifier,
      description: identifier,
      icon: identifier,
      percentage,
      trend,
    };
  });
}

function sortBehavior(
  compliance: Behavior[],
  support: Behavior[]
): { sortedCompliance: Behavior[]; sortedSupport: Behavior[] } {
  const sortedCompliance = compliance.sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

  const sortedSupport = support.sort((a, b) => {
    return (
      sortedCompliance.findIndex((x) => x.id === a.id) -
      sortedCompliance.findIndex((x) => x.id === b.id)
    );
  });

  return { sortedCompliance, sortedSupport };
}

function formatAndSortBehavior(
  behavior: BehaviorValue
): { sortedCompliance: Behavior[]; sortedSupport: Behavior[] } {
  const compliance = formatBehaviorType(behavior, 'compliance');
  const support = formatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}

export function BehaviorTile({ behavior, children }: BehaviorTileProps) {
  const { sortedCompliance, sortedSupport } = formatAndSortBehavior(behavior);
  const [behaviorType, onChangeControls] = useState<'compliance' | 'support'>(
    'compliance'
  );
  return (
    <Tile>
      {children}
      <BehaviorTypeControls onChange={onChangeControls}></BehaviorTypeControls>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Percentage</th>
            <th>Basisregel</th>
            <th>Verschil met vorige regel</th>
          </tr>
        </thead>
        {(behaviorType === 'compliance' ? sortedCompliance : sortedSupport).map(
          (behavior) => (
            <tr key={behavior.id}>
              <td>{formatPercentage(behavior.percentage ?? 0)}%</td>
              <td>
                <PercentageBar percentage={behavior.percentage ?? 0} />
              </td>
              <td>{behavior.description}</td>
              <td>{behavior.trend}</td>
            </tr>
          )
        )}
      </table>
    </Tile>
  );
}
