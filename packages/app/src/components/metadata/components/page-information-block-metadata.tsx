import { Box } from '~/components/base';
import { Clock, Database, MeerInformatie } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { Text } from '~/components/typography';
import React from 'react';
import { MetadataIcon } from '~/components/metadata/components/items/metadata-icon';
import { MetadataItem } from '~/components/metadata/components/items/metadata-item';
import { MetadataProps } from '~/components';
import { useIntl } from '~/intl';
import { MetadataReference } from '~/components/metadata/components/items/metadata-reference';

interface PageInformationBlockMetadataProps extends MetadataProps {
  dateText: string | 0 | undefined;
}

/**
 * PageInformationBlockMetadata is a functional component that renders the metadata items in the page information block.
 *
 * @export
 * @function
 * @name PageInformationBlockMetadata
 * @param {PageInformationBlockMetadataProps} props - The properties that define the metadata items to be displayed.
 * @param {string} props.dateText - The text representation of the date.
 * @param {Source[]} [props.dataSources=[]] - Array of data sources for the metadata.
 * @param {JsonSource[]} [props.jsonSources=[]] - Array of JSON sources for the metadata.
 * @param {string} [props.referenceLink] - Reference link for the metadata.
 * @param {string} props.accessibilitySubject - Accessibility subject text for the metadata.
 * @param {string} props.moreInformationLabel - Label for the "More Information" link.
 * @param {{href: string, text: string}} props.moreInformationLink - "More Information" link object, with href and text properties.
 * @returns {ReactElement} A React element that contains the page information block with metadata items.
 */
export function PageInformationBlockMetadata({
  dateText,
  dataSources = [],
  jsonSources = [],
  referenceLink,
  accessibilitySubject,
  moreInformationLabel,
  moreInformationLink,
}: PageInformationBlockMetadataProps) {
  const { commonTexts } = useIntl();
  const metadataText = commonTexts.common.metadata;

  return (
    <Box spacing={2}>
      <Box display="flex" alignItems="flex-start" color="gray7">
        <MetadataIcon>
          <Clock aria-hidden color={colors.gray7} />
        </MetadataIcon>
        <Text variant="label1">{dateText}</Text>
      </Box>

      {dataSources.length > 0 && (
        <MetadataItem
          icon={<Database aria-hidden />}
          items={dataSources}
          label={referenceLink ? commonTexts.informatie_header.bron : metadataText.source}
          accessibilityText={commonTexts.accessibility.text_source}
          accessibilitySubject={accessibilitySubject}
          referenceLink={referenceLink}
        />
      )}

      {referenceLink && <MetadataReference icon={<MeerInformatie aria-hidden />} referenceLink={referenceLink} />}

      {jsonSources.length > 0 && <MetadataItem icon={<MeerInformatie aria-hidden />} items={jsonSources} label={metadataText.metrics_json_links.metrics_json_source} />}

      {moreInformationLabel && <MetadataItem icon={<MeerInformatie aria-hidden />} items={moreInformationLink ? [moreInformationLink] : []} label={moreInformationLabel} />}
    </Box>
  );
}
