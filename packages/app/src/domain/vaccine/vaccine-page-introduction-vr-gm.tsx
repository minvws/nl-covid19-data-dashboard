import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading } from '~/components/typography';
import { VaccineHeaderWithIcon } from './components/vaccine-header-with-icon';

interface VaccinePageIntroductionVrGm {
  title: string;
  description: string;
  kpiTitle: string;
  kpiValue: number;
}

export function VaccinePageIntroductionVrGm({
  title,
  description,
  kpiTitle,
  kpiValue,
}: VaccinePageIntroductionVrGm) {
  return (
    <Tile>
      <Box spacing={3}>
        <VaccineHeaderWithIcon title={title} />

        <TwoKpiSection>
          <Box as="article" spacing={2} px={{ md: 5 }}>
            <Heading level={3}>{kpiTitle}</Heading>
            <KpiValue percentage={kpiValue} />
            <Markdown content={description} />
          </Box>

          <div />
        </TwoKpiSection>
      </Box>
    </Tile>
  );
}
