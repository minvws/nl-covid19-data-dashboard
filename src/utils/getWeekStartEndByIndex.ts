export type Week = {
  start: number;
  end: number;
};

export function getWeekStartEndByIndex(weekSet: Week[], index: number): Week {
  return weekSet[index];
}
