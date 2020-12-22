/**
 * The RelativeDate provides a relative date in a context in which it can be interpeted
 * * as human readable relative date, if possible
 * * a full date in a tooltip
 * * machine readable iso dates
 */

import css from "@styled-system/css";
import styled from "styled-components";
import { formatDateFromSeconds } from "~/utils/formatDate";

interface RelativeDateProps {
  dateInSeconds: number;
}

export function RelativeDate({ dateInSeconds }: RelativeDateProps) {
  const isoDate = formatDateFromSeconds(dateInSeconds, 'iso');
  const fullDate = formatDateFromSeconds(dateInSeconds, 'medium');

  // Relative dates only become relative whn ran in the browser with JS on.
  // Non-JS versions are the day and month.
  const displayDate = formatDateFromSeconds(dateInSeconds, 'relative');

  return <Time dateTime={isoDate} title={fullDate}>{displayDate}</Time>
}

const Time = styled.time(css({
  cursor: 'help'
}));
