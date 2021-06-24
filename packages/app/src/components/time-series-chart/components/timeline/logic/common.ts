export interface TimelineEventConfig {
  start: number;
  end: number | undefined;
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
    x0: number;
    x1: number;
    x0IsOutOfBounds: boolean;
    x1IsOutOfBounds: boolean;
  };
  highlight: {
    x0: number;
    x1: number;
  };
}
