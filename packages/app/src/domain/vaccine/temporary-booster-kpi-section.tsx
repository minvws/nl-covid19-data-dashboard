import css from '@styled-system/css';
import { Box } from '~/components/base';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';

const DATE_UNIX_FOR_KEY_MODE = 1638705600;
const METRIC_FOR_KEY_MODE = 9999;

export function TemporaryBoosterKpiSection() {
  const { siteText, dataset, formatNumber } = useIntl();

  const text = siteText.vaccinaties.four_kpi_section;

  return (
    <Box spacing={4}>
      <TwoKpiSection>
        <KpiTile
          title={text.total_booster_and_third_shots.title}
          metadata={{
            date:
              dataset === 'keys'
                ? DATE_UNIX_FOR_KEY_MODE
                : Number(text.total_booster_and_third_shots.date_unix),
            source: {
              href: text.total_booster_and_third_shots.sources.href,
              text: text.total_booster_and_third_shots.sources.text,
            },
          }}
        >
          <Text
            as="div"
            css={css({
              color: 'data.primary',
              fontSize: 9,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            })}
          >
            {dataset === 'keys'
              ? METRIC_FOR_KEY_MODE
              : formatNumber(Number(text.total_booster_and_third_shots.metric))}
          </Text>
          <Markdown content={text.total_booster_and_third_shots.description} />
        </KpiTile>

        <KpiTile
          title={text.boosters_ggd.title}
          metadata={{
            date:
              dataset === 'keys'
                ? DATE_UNIX_FOR_KEY_MODE
                : Number(text.boosters_ggd.date_unix),
            source: {
              href: text.boosters_ggd.sources.href,
              text: text.boosters_ggd.sources.text,
            },
          }}
        >
          <KpiValue
            absolute={
              dataset === 'keys'
                ? METRIC_FOR_KEY_MODE
                : Number(text.boosters_ggd.metric)
            }
          />
          <Markdown content={text.boosters_ggd.description} />
        </KpiTile>
      </TwoKpiSection>

      <TwoKpiSection>
        <KpiTile
          title={text.estimated_boosters_other_operators.title}
          metadata={{
            date:
              dataset === 'keys'
                ? DATE_UNIX_FOR_KEY_MODE
                : Number(text.estimated_boosters_other_operators.date_unix),
            source: {
              href: text.estimated_boosters_other_operators.sources.href,
              text: text.estimated_boosters_other_operators.sources.text,
            },
          }}
        >
          <KpiValue
            absolute={
              dataset === 'keys'
                ? METRIC_FOR_KEY_MODE
                : Number(text.estimated_boosters_other_operators.metric)
            }
          />
          <Markdown
            content={text.estimated_boosters_other_operators.description}
          />
        </KpiTile>

        <KpiTile
          title={text.third_shots_ggd.title}
          metadata={{
            date:
              dataset === 'keys'
                ? DATE_UNIX_FOR_KEY_MODE
                : Number(text.third_shots_ggd.date_unix),
            source: {
              href: text.third_shots_ggd.sources.href,
              text: text.third_shots_ggd.sources.text,
            },
          }}
        >
          <KpiValue
            absolute={
              dataset === 'keys'
                ? METRIC_FOR_KEY_MODE
                : Number(text.third_shots_ggd.metric)
            }
          />
          <Markdown content={text.third_shots_ggd.description} />
        </KpiTile>
      </TwoKpiSection>
    </Box>
  );
}
