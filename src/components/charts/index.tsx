import dynamic from 'next/dynamic';

export const AreaChart = dynamic(() => import('~/components/areaChart'));
export const BarChart = dynamic(() => import('~/components/barChart'));
