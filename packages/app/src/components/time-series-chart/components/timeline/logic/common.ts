export interface TimelineEventConfig {
  date: number | [number, number];
  title: string;
  description: string;
}

export interface TimelineState {
  index: number | undefined;
  setIndex: (index: number | undefined) => void;
  events: TimelineEventConfig[];
  ranges: TimelineEventRange[];
  current?: {
    event: TimelineEventConfig;
    range: TimelineEventRange;
  };
}

export interface TimelineEventRange {
  timeline: {
    start: number;
    end: number;
    startIsOutOfBounds: boolean;
    endIsOutOfBounds: boolean;
  };
  highlight: {
    start: number;
    end: number;
  };
}
