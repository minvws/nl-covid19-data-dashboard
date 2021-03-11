import { localPoint } from '@visx/event';
import { Point } from '@visx/point';
import { ChartPadding } from '~/components-styled/line-chart/components';

type EventType =
  | MouseEvent
  | TouchEvent
  | FocusEvent
  | React.MouseEvent
  | React.TouchEvent
  | React.FocusEvent;

export function localPointWithPadding(
  nodeOrEvent: Element | EventType,
  padding: ChartPadding
): Point | null {
  const mousePoint = localPoint(nodeOrEvent);
  if (!mousePoint) {
    return null;
  }
  return new Point({
    x: mousePoint.x,
    y: mousePoint.y - padding.top,
  });
}
