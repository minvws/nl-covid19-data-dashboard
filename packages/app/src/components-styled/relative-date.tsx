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
  capitalize?: boolean;
}

export function RelativeDate({ dateInSeconds, capitalize }: RelativeDateProps) {
  const isoDate = formatDateFromSeconds(dateInSeconds, 'iso');
  const fullDate = formatDateFromSeconds(dateInSeconds, 'medium');

  // Relative dates only become relative when run in the browser with JS on.
  // Non-JS versions are the day and month.
  let displayDate = formatDateFromSeconds(dateInSeconds, 'relative');

  if (capitalize) {
    displayDate = displayDate.charAt(0).toUpperCase() + displayDate.substr(1);
  }

  return <Time dateTime={isoDate} title={fullDate}>{displayDate}</Time>
}

const Time = styled.time(css({
  cursor: 'help'
}));
