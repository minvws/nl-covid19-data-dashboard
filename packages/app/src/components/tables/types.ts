import { BehaviorIdentifier } from "~/domain/behavior/logic/behavior-types";

export type PercentageDataPoint = {
  title: string;
  trendDirection?: 'up' | 'down' | 'equal' | null;
  percentage: {
    color: string;
    value: number | string;
  };
};

type ScrollRef = { current: HTMLDivElement | null };

export interface CommonTableProps {
  percentageData: PercentageDataPoint[][];
  hasAgeGroups?: boolean;
  hasIcon?: boolean;
  onClickConfig?: {
    handler: (id: BehaviorIdentifier, scrollRef: ScrollRef) => void,
    scrollRef: ScrollRef;
  };
}
