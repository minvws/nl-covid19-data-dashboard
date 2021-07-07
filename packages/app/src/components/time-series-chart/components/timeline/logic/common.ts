export interface TimelineEventConfig {
  title: string;
  description: string;
  start: number;
  end?: number;
}

export interface TimelineState {
  index: number | undefined;
  setIndex: (index: number | undefined) => void;
  events: TimelineEventConfig[];
  xOffsets: TimelineEventXOffset[];
  current?: {
    event: TimelineEventConfig;
    xOffset: TimelineEventXOffset;
  };
}

export interface TimelineEventXOffset {
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
