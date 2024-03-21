import { Box } from '~/components/base';
import { KpiTile, KpiValue, TwoKpiSection, Message, MetadataProps } from '~/components';
import { useIntl } from '~/intl';

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

export function VaccinationsShotKpiSection({ text, value, metadata }: VaccinationsShotKpiSectionProps) {
  const { formatNumber } = useIntl();
  return (
    <TwoKpiSection hasBorder hasPadding>
      <KpiTile title={text.title} hasNoBorder hasNoPaddingBottom description={text.description} metadata={metadata}>
        <KpiValue text={formatNumber(value)} />
        {text.warning && <Message variant="warning">{text.warning}</Message>}
      </KpiTile>
      <Box />
    </TwoKpiSection>
  );
}
