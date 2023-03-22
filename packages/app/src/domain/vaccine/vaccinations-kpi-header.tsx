import { Box } from '~/components/base';
import { PageInformationBlock } from '~/components/page-information-block';
import { Boosterprik as BoosterIcon } from '@corona-dashboard/icons';

type ReferenceType = {
  href: string;
  text?: string;
};

type SourceType = {
  text: string;
  href: string;
};

type TextTypes = {
  datums: string;
  description: string;
  reference: ReferenceType;
  sources: SourceType;
  title: string;
};

interface VaccineKpiHeaderProps {
  text: TextTypes;
  dateUnix: number;
  dateOfInsertionUnix: number;
}

export function VaccinationsKpiHeader({ text, dateUnix, dateOfInsertionUnix }: VaccineKpiHeaderProps) {
  return (
    <Box paddingTop="40px" borderTopWidth="2px" borderColor="gray3" borderStyle="solid">
      <PageInformationBlock
        icon={<BoosterIcon />}
        title={text.title}
        description={text.description}
        metadata={{
          datumsText: text.datums,
          dateOrRange: dateUnix,
          dateOfInsertionUnix: dateOfInsertionUnix,
          dataSources: [text.sources],
        }}
        referenceLink={text.reference.href}
      />
    </Box>
  );
}
