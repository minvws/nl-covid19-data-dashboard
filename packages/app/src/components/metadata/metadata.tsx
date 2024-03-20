import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import { ExternalLink } from '~/components/external-link';
import { insertDateIntoString } from '~/components/metadata/logic/insert-date-into-string';
import { MetadataProps } from './types';
import { PageInformationBlockMetadata } from '~/components/metadata/components/page-information-block-metadata';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';
import { Text } from '../typography';
import { TileFooterMetadata } from '~/components/metadata/components/tile-footer-metadata';
import { useIntl } from '~/intl';
import React from 'react';

/**
 * @function
 * @name Metadata
 * @description A function component that generates a metadata interface based on the provided parameters. It handles
 *  multiple use cases, including tile footers, single or multiple data sources, different date formats, and intervals.
 *  It also provides an option for a disclaimer and more information label.
 * @param {MetadataProps} props - The properties object containing all necessary parameters for Metadata function.
 * @returns {JSX.Element} JSX Element that represents metadata information.
 */
export function Metadata({
  accessibilitySubject,
  dataSources = [],
  date,
  dateOfInsertion,
  dateOrRange,
  datumsText,
  disclaimer,
  intervalCount,
  isArchivedGraph = false,
  isPageInformationBlock,
  isTileFooter,
  jsonSources = [],
  marginBottom,
  moreInformationLabel,
  moreInformationLink,
  obtainedAt,
  referenceLink,
  source,
  timeInterval,
}: MetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();

  const dateString =
    typeof date === 'number'
      ? replaceVariablesInText(commonTexts.common.metadata.date, {
          date: formatDateFromSeconds(date, 'axis-with-year'),
        })
      : typeof date === 'string'
      ? date
      : date && date.start && date.end
      ? replaceVariablesInText(commonTexts.common.metadata.date_from_to, {
          startDate: formatDateFromSeconds(date.start, 'weekday-long'),
          endDate: formatDateFromSeconds(date.end, 'weekday-long'),
        })
      : null;

  const dateText = datumsText && dateOfInsertion && dateOrRange ? insertDateIntoString(formatDateFromSeconds, datumsText, dateOfInsertion, dateOrRange) : undefined;

  const intervalString =
    intervalCount &&
    replaceVariablesInText(commonTexts.common.metadata.interval, {
      count: intervalCount,
    });

  return (
    <>
      {!isTileFooter && source && (
        <Text color="gray7" variant="label1">
          {`${dateString} - ${commonTexts.common.metadata.source}: `}
          <ExternalLink ariaLabel={source.ariaText} href={source.href}>
            {source.text}
            <ExternalLinkIcon width={space[3]} height={space[2]} />
          </ExternalLink>
        </Text>
      )}

      {isPageInformationBlock && (
        <PageInformationBlockMetadata
          dateText={dateText}
          dataSources={dataSources}
          jsonSources={jsonSources}
          referenceLink={referenceLink}
          accessibilitySubject={accessibilitySubject}
          moreInformationLabel={moreInformationLabel}
          moreInformationLink={moreInformationLink}
        />
      )}

      {isTileFooter && (
        <TileFooterMetadata
          dateString={dateString}
          marginBottom={marginBottom}
          datumsText={datumsText}
          date={date}
          timeInterval={timeInterval}
          dateOfInsertion={dateOfInsertion}
          isArchivedGraph={isArchivedGraph}
          source={source}
          dataSources={dataSources}
          referenceLink={referenceLink}
          disclaimer={disclaimer}
          obtainedAt={obtainedAt}
          intervalString={intervalString}
        />
      )}
    </>
  );
}
