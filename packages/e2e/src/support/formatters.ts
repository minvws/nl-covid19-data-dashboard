import { createFormatting } from '@corona-dashboard/common';

export type Formatters = ReturnType<typeof createFormatting>;

const formatters = createFormatting('nl-NL', {
  date_today: 'vandaag',
  date_yesterday: 'gisteren',
  date_day_before_yesterday: 'eergisteren',
});

(cy as any).formatters = formatters;
