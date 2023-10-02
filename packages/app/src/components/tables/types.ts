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

export interface BaseTableData {
  id: string;
  firstColumnLabel: React.ReactNode;
  description?: string;
  ageGroupRange?: string;
}

export interface SingleCoverageTableData extends BaseTableData {
  firstPercentage: number | null;
  firstPercentageTrend?: BehaviorTrendType;
}

export interface TableData extends BaseTableData {
  firstPercentage: number | null;
  secondPercentage: number | null;
  firstPercentageTrend?: TrendDirection;
  secondPercentageTrend?: TrendDirection;
}

export type BaseCoverageTable = BaseTableData;

export interface CommonTableProps {
  tableData: SingleCoverageTableData[] | TableData[];
  percentageData: PercentageDataPoint[][];
}
