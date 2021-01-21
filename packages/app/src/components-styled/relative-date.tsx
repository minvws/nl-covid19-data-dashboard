/**
 * The RelativeDate provides a relative date in a context in which it can be interpeted
 * - as human readable relative date, if possible
 * - a full date in a tooltip
 * - machine readable iso dates
 */

import css from '@styled-system/css';
import styled from 'styled-components';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { useIsMounted } from '~/utils/use-is-mounted';

interface RelativeDateProps {
  dateInSeconds: number;
  isCapitalized?: boolean;
}

export function RelativeDate({
  dateInSeconds,
  isCapitalized,
}: RelativeDateProps) {
  const isMounted = useIsMounted();
  const isoDate = formatDateFromSeconds(dateInSeconds, 'iso');
  const fullDate = formatDateFromSeconds(dateInSeconds, 'medium');
  let displayDate = formatDateFromSeconds(dateInSeconds, 'relative');

  if (isCapitalized) {
    displayDate = displayDate.charAt(0).toUpperCase() + displayDate.substr(1);
  }

  return (
    <Time dateTime={isoDate} title={fullDate}>
      {isMounted ? displayDate : fullDate}
    </Time>
  );
}

const Time = styled.time(
  css({
    cursor: 'help',
  })
);
