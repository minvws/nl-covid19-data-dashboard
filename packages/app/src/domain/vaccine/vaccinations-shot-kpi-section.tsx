import { useIntl } from '~/intl';
import {
  KpiTile,
  KpiValue,
  Markdown,
  TwoKpiSection,
  Metadata,
  Message,
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
  dateUnix: number;
  value: number;
}

export function VaccinationsShotKpiSection({
  text,
  dateUnix,
  value,
}: VaccinationsShotKpiSectionProps) {
  const { formatNumber } = useIntl();

  return (
    <TwoKpiSection hasBorder hasPadding>
      <KpiTile title={text.title} hasNoBorder>
        <KpiValue text={formatNumber(value)} />
        <Markdown content={text.description} />
        {text.warning && <Message variant="warning">{text.warning}</Message>}
        <Metadata
          date={dateUnix}
          datumsText={text.datums}
          source={{
            href: text.sources.href ? text.sources.href : '',
            text: text.sources.text,
          }}
        />
      </KpiTile>
      <Box />
    </TwoKpiSection>
  );
}
