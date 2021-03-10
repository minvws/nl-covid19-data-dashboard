/**
 * The RelativeDate provides a relative date in a context in which it can be interpreted
 * - as human readable relative date, if possible
 * - a full date in a tooltip
 * - machine readable iso dates
 */

import css from '@styled-system/css';
import styled from 'styled-components';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useIsMounted } from '~/utils/use-is-mounted';

interface RelativeDateProps {
  dateInSeconds: number;
  isCapitalized?: boolean;
  /* absoluteDateTemplate is used when there is no relative date, to fix the sentence structure */
  absoluteDateTemplate?: string;
}

export function RelativeDate({
  dateInSeconds,
  isCapitalized,
  absoluteDateTemplate,
}: RelativeDateProps) {
  const isMounted = useIsMounted();
  const isoDate = formatDateFromSeconds(dateInSeconds, 'iso');
  const fullDate = formatDateFromSeconds(dateInSeconds, 'medium');
  const relativeDate = formatDateFromSeconds(dateInSeconds, 'relative');

  /* Date to display; relative date is only available in browsers, not on server. */
  let displayDate = isMounted ? relativeDate : fullDate;

  /* Format absolute dates when a template is provided (used to construct grammatically correct sentences) */
  if (absoluteDateTemplate && displayDate.match(/[0-9]/)) {
    displayDate = replaceVariablesInText(absoluteDateTemplate, {
      date: displayDate,
    });
  }

  /* Capitalize the chunk when it's at the start of a sentence. */
  if (isCapitalized) {
    displayDate = displayDate.charAt(0).toUpperCase() + displayDate.substr(1);
  }

  // if the displaydate is something like 'today' or 'yesterday', we put the full date behind it
  const suffix = fullDate.startsWith(displayDate) ? '' : ` (${fullDate})`;

  return (
    <Time dateTime={isoDate} title={fullDate}>
      {displayDate}
      {suffix}
    </Time>
  );
}

const Time = styled.time(
  css({
    cursor: 'help',
  })
);
