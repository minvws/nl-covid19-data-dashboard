import { Box } from '~/components/base';
import { PageInformationBlock } from '~/components/page-information-block';
import { VaccineBoosterThird as BoosterIcon } from '@corona-dashboard/icons';

type ReferenceType = {
  href?: string;
};

type SourceType = {
  text: string;
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
  date: number;
  dateOfInsertionUnix: number;
}

export function VaccinationsKpiHeader({
  text,
  date,
  dateOfInsertionUnix,
}: VaccineKpiHeaderProps) {
  return (
    <Box pt={40} borderTopWidth={2} borderColor="silver" borderStyle="solid">
      <PageInformationBlock
        icon={<BoosterIcon />}
        title={text.title}
        description={text.description}
        metadata={{
          datumsText: text.datums,
          dateOrRange: date,
          dateOfInsertionUnix: dateOfInsertionUnix,
          dataSources: [
            {
              href: '',
              text: text.sources.text,
              download: '',
            },
          ],
        }}
        referenceLink={text.reference.href}
      />
    </Box>
  );
}
