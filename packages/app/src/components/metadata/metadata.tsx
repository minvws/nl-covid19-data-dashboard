import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import { ExternalLink } from '~/components/external-link';
import { Text } from '../typography';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';
import React from 'react';
import { insertDateIntoString } from '~/components/metadata/logic/insert-date-into-string';
import { MetadataProps } from './types';
import { PageInformationBlockMetadata } from '~/components/metadata/components/page-information-block-metadata';
import { TileFooterMetadata } from '~/components/metadata/components/tile-footer-metadata';

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
  dataSources = [],
  date,
  dateOfInsertionUnix,
  datePeriod,
  datumsText,
  disclaimer,
  intervalCount,
  isArchivedGraph = false,
  isTileFooter,
  isPageInformationBlock,
  marginBottom,
  obtainedAt,
  source,
  dateOrRange,
  accessibilitySubject,
  moreInformationLabel,
  moreInformationLink,
  referenceLink,
  jsonSources = [],
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

  const dateText = datumsText && dateOfInsertionUnix && dateOrRange && insertDateIntoString(formatDateFromSeconds, datumsText, dateOfInsertionUnix, dateOrRange);

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
          datePeriod={datePeriod}
          dateOfInsertionUnix={dateOfInsertionUnix}
          isArchivedGraph={isArchivedGraph}
          source={source}
          dataSources={dataSources}
          referenceLink={referenceLink}
          disclaimer={disclaimer}
          obtainedAt={obtainedAt}
          intervalCount={intervalCount}
        />
      )}
    </>
  );
}
