import dynamic from 'next/dynamic';

export const AreaChart = dynamic(() => import('~/components/areaChart'));
export const LineChart = dynamic(() => import('~/components/lineChart'));
