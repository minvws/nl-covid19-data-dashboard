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
 * @param {Source[]} [props.dataSources=[]] - Array of data sources for the metadata.
 * @param {number} props.dateOfInsertion - Unix timestamp of when the metadata was inserted.
 * @param {string} props.disclaimer - Disclaimer text for the metadata.
 * @param {boolean} props.isArchived - Flag indicating whether the metadata is for an archived KPI / Graph / Choropleth.
 * @param {string} [props.referenceLink] - Reference link for the metadata.
 * @param {Source} props.source - Source of the metadata.
 * @returns {ReactElement} A React element that contains the tile footer with metadata items.
 */
export function TileFooterMetadata({ dateString, marginBottom, dataSources = [], dateOfInsertion, disclaimer, isArchived, referenceLink, source }: TileFooterMetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const metadataText = commonTexts.common.metadata;

  return (
    <Box as="footer" marginTop={space[3]} marginBottom={marginBottom || { _: '0', sm: `-${space[3]}` }} gridArea="metadata">
      <Text color="gray7" variant="label1">
        <>
          {disclaimer && (
            <Box paddingBottom={space[2]}>
              <Markdown content={disclaimer}></Markdown>
            </Box>
          )}

          {dateString && (
            <Box display="flex" alignItems="flex-start" color="gray7" marginBottom={space[1]}>
              <MetadataIcon>
                <Calendar aria-hidden color={colors.gray7} />
              </MetadataIcon>
              <Text variant="label1">{dateString}</Text>
            </Box>
          )}

          {dateOfInsertion && (
            <Box display="flex" alignItems="flex-start" color="gray7" marginBottom={space[1]}>
              <MetadataIcon>
                <Clock aria-hidden color={colors.gray7} />
              </MetadataIcon>
              <Text variant="label1">
                {isArchived
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
        </>
      </Text>
    </Box>
  );
}
