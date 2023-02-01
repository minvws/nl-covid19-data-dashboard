import React from 'react';
import { BehaviorTrendType } from '~/domain/behavior/logic/behavior-types';

type TrendDirection = BehaviorTrendType | null;

export type PercentageDataPoint = {
  title: string;
  trendDirection?: TrendDirection;
  percentage: {
    color: string;
    value: number | string;
  };
};

export interface TableData {
  id: string;
  firstColumnLabel: React.ReactNode;
  firstPercentage: number | null;
  secondPercentage: number | null;
  firstPercentageTrend?: TrendDirection;
  secondPercentageTrend?: TrendDirection;
  description?: string;
  ageGroupRange?: string;
}

export interface CommonTableProps {
  tableData: TableData[];
  percentageData: PercentageDataPoint[][];
}
