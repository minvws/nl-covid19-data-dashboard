import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { useIntl } from '~/intl';
import { Metadata } from '~/components/metadata';
import { Message } from '~/components/message';

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
    <TwoKpiSection>
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
    </TwoKpiSection>
  );
}
