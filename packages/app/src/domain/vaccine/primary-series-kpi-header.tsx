import { PageInformationBlock } from '~/components';
import { Vaccinaties as VaccinatieIcon } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { MetadataProps } from '~/components/page-information-block/components/metadata';

interface PrimarySeriesKpiHeaderProps {
  title: string;
  description: string;
  metadata: MetadataProps;
}

export function PrimarySeriesKpiHeader({ title, description, metadata }: PrimarySeriesKpiHeaderProps) {
  return (
    <Box paddingTop="40px" borderTopWidth="2px" borderColor="gray3" borderStyle="solid">
      <PageInformationBlock
        title={title}
        description={description}
        icon={<VaccinatieIcon aria-hidden="true" />}
        metadata={{
          datumsText: metadata.datumsText,
          dateOrRange: metadata.dateOrRange,
          dateOfInsertionUnix: metadata.dateOfInsertionUnix,
          dataSources: metadata.dataSources,
        }}
      />
    </Box>
  );
}
