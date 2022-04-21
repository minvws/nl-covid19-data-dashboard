import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Tile } from '~/components/tile';
import { InlineText, Text, Heading, BoldText } from '~/components/typography';
import { Message } from '~/components/message';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Metadata, MetadataProps } from '~/components/metadata';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Markdown } from '~/components/markdown';
import { SiteText } from '~/locale';

interface VaccineBoosterAdministrationsKpiSectionProps {
  totalBoosterShots: number;
  metadateBoosterShots: MetadataProps;
  boosterGgdValue: number;
  metadateBoosterGgd: MetadataProps;
  boosterEstimatedValue: number;
  metadateBoosterEstimated: MetadataProps;
  boosterShotLastSevenDays: number;
  metadataBoosterShotLastSevenDays: MetadataProps;
  text: SiteText['pages']['vaccinationsPage']['nl']['booster_kpi'];
}

export function VaccineBoosterAdministrationsKpiSection({
  totalBoosterShots,
  metadateBoosterShots,
  boosterGgdValue,
  metadateBoosterGgd,
  boosterEstimatedValue,
  metadateBoosterEstimated,
  boosterShotLastSevenDays,
  metadataBoosterShotLastSevenDays,
  text,
}: VaccineBoosterAdministrationsKpiSectionProps) {
  const { formatNumber } = useIntl();

  return (
    <Tile>
      <Box mb={20}>
        <TwoKpiSection>
          <Heading level={3}>{text.title}</Heading>
          <Box />
        </TwoKpiSection>
      </Box>
      <TwoKpiSection>
        <Box spacing={3}>
          <KpiValue absolute={totalBoosterShots} />
          <Text>{text.total_booster_shots.description}</Text>
          {text.total_booster_shots.warning && (
            <Message variant="warning">
              {text.total_booster_shots.warning}
            </Message>
          )}
          <Metadata {...metadateBoosterShots} isTileFooter />

          <Markdown
            content={replaceVariablesInText(
              text.booster_shot_last_seven_days.description,
              {
                amount: formatNumber(boosterShotLastSevenDays),
              }
            )}
          />
          <Metadata {...metadataBoosterShotLastSevenDays} />
        </Box>
        <Box spacing={4}>
          <BoosterAdministeredItem
            value={boosterGgdValue}
            description={text.booster_ggd.title}
            metadata={metadateBoosterGgd}
          />
          <BoosterAdministeredItem
            value={boosterEstimatedValue}
            description={text.booster_estimated.title}
            metadata={metadateBoosterEstimated}
          />
        </Box>
      </TwoKpiSection>
    </Tile>
  );
}

interface BoosterAdministeredProps {
  value: number;
  description: string;
  metadata: MetadataProps;
}

function BoosterAdministeredItem(props: BoosterAdministeredProps) {
  const { value, description, metadata } = props;

  const { formatNumber } = useIntl();

  return (
    <Box spacing={1}>
      <BoldText>
        {replaceComponentsInText(description, {
          value: (
            <InlineText color="data.primary">{formatNumber(value)}</InlineText>
          ),
        })}
      </BoldText>

      <Metadata {...metadata} isTileFooter />
    </Box>
  );
}
