import { Box } from '~/components/base';
import { Calendar, Clock, Database } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { Markdown, MetadataProps } from '~/components';
import { MetadataIcon } from '~/components/metadata/components/items/metadata-icon';
import { MetadataItem } from '~/components/metadata/components/items/metadata-item';
import { replaceVariablesInText } from '~/utils';
import { space } from '~/style/theme';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import React from 'react';

interface TileFooterMetadataProps extends MetadataProps {
  dateString: string | null;
  intervalString: string | undefined;
}

/**
 * TileFooterMetadata is a functional component that renders the metadata items inside a tile footer.
 *
 * @export
 * @function
 * @name TileFooterMetadata
 * @param {TileFooterMetadataProps} props - The properties that define the metadata items to be displayed.
 * @param {string|null} props.dateString - The string representation of the date or null.
 * @param {string} props.marginBottom - The margin-bottom property of the TileFooterMetadata component.
 * @param {string} props.datumsText - Textual representation of the metadata date.
 * @param {(number|DateRange|string)} props.date - Date of the metadata item. It can be a number, a DateRange object, or a string.
 * @param {DateRange} props.datePeriod - Date range for the metadata.
 * @param {number} props.dateOfInsertion - Unix timestamp of when the metadata was inserted.
 * @param {boolean} props.isArchivedGraph - Flag indicating whether the metadata is for an archived graph.
 * @param {Source} props.source - Source of the metadata.
 * @param {Source[]} [props.dataSources=[]] - Array of data sources for the metadata.
 * @param {string} [props.referenceLink] - Reference link for the metadata.
 * @param {string} props.disclaimer - Disclaimer text for the metadata.
 * @param {number} props.obtainedAt - Unix timestamp of when the metadata was obtained.
 * @param {string} props.intervalCount - Interval count for the metadata.
 * @returns {ReactElement} A React element that contains the tile footer with metadata items.
 */
export function TileFooterMetadata({
  dataSources = [],
  date,
  dateOfInsertion,
  dateString,
  datumsText,
  disclaimer,
  intervalString,
  isArchivedGraph,
  marginBottom,
  obtainedAt,
  referenceLink,
  source,
  timeframePeriod,
}: TileFooterMetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const metadataText = commonTexts.common.metadata;

  return (
    <Box as="footer" marginTop={space[3]} marginBottom={marginBottom || { _: '0', sm: `-${space[3]}` }} gridArea="metadata">
      <Text color="gray7" variant="label1">
        {datumsText && Array.isArray(date) ? (
          replaceVariablesInText(datumsText, {
            weekStart: formatDateFromSeconds(date[0], 'weekday-long'),
            weekEnd: formatDateFromSeconds(date[1], 'weekday-long'),
          })
        ) : (
          <>
            {timeframePeriod && (
              <Box display="flex" alignItems="flex-start" color="gray7">
                <MetadataIcon>
                  <Calendar aria-hidden color={colors.gray7} />
                </MetadataIcon>
                <Text variant="label1">
                  {replaceVariablesInText(commonTexts.common.metadata.time_interval, {
                    dateStart: formatDateFromSeconds(timeframePeriod.start, 'weekday-long'),
                    dateEnd: formatDateFromSeconds(timeframePeriod.end, 'weekday-long'),
                  })}
                </Text>
              </Box>
            )}

            {dateOfInsertion && (
              <Box display="flex" alignItems="flex-start" color="gray7" marginY={space[1]}>
                <MetadataIcon>
                  <Clock aria-hidden color={colors.gray7} />
                </MetadataIcon>
                <Text variant="label1">
                  {isArchivedGraph
                    ? replaceVariablesInText(commonTexts.common.metadata.last_insertion_date_archived, {
                        dateOfInsertion: formatDateFromSeconds(dateOfInsertion, 'weekday-long'),
                      })
                    : replaceVariablesInText(commonTexts.common.metadata.last_insertion_date, { dateOfInsertion: formatDateFromSeconds(dateOfInsertion, 'weekday-long') })}
                </Text>
              </Box>
            )}

            {source ? (
              <MetadataItem icon={<Database aria-hidden />} items={[source]} label={commonTexts.common.metadata.source} />
            ) : dataSources && dataSources.length > 0 ? (
              <MetadataItem
                icon={<Database aria-hidden color={colors.gray7} />}
                items={dataSources}
                label={referenceLink ? commonTexts.informatie_header.bron : metadataText.source}
              />
            ) : null}

            {disclaimer && (
              <Box paddingBottom={space[3]}>
                <Markdown content={disclaimer}></Markdown>
              </Box>
            )}
            {dateString}
            {obtainedAt &&
              ` ${replaceVariablesInText(commonTexts.common.metadata.obtained, {
                date: formatDateFromSeconds(obtainedAt, 'axis-with-year'),
              })}`}
            {intervalString && `. ${intervalString}`}
          </>
        )}
      </Text>
    </Box>
  );
}
