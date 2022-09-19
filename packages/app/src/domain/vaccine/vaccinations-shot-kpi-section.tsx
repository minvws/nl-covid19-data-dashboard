import { useIntl } from '~/intl';
import {
  KpiTile,
  KpiValue,
  Markdown,
  TwoKpiSection,
  Metadata,
  Message,
  MetadataProps,
} from '~/components';
import { Box } from '~/components/base';

type SourceType = {
  text: string;
  href?: string;
};

type TextTypes = {
  datums: string;
  description: string;
  warning: string;
  sources: SourceType;
  title: string;
};

interface VaccinationsShotKpiSectionProps {
  text: TextTypes;
  value: number;
  metadata: MetadataProps;
}

export function VaccinationsShotKpiSection({
  text,
  value,
  metadata,
}: VaccinationsShotKpiSectionProps) {
  const { formatNumber } = useIntl();
  return (
    <TwoKpiSection hasBorder hasPadding>
      <KpiTile title={text.title} hasNoBorder hasNoPaddingBottom>
        <KpiValue text={formatNumber(value)} />
        <Markdown content={text.description} />
        {text.warning && <Message variant="warning">{text.warning}</Message>}
        <Metadata {...metadata} isTileFooter />
      </KpiTile>
      <Box />
    </TwoKpiSection>
  );
}
