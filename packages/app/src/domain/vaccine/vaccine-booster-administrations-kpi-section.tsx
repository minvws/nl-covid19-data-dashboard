import { Box } from '~/components/base';
import { KpiValue } from '~/components/kpi-value';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Tile } from '~/components/tile';
import { InlineText, Text, Heading } from '~/components/typography';
import { Message } from '~/components/message';
import { LokalizeMetadata } from '~/components/lokalize-metadata';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useFormatLokalizePercentage } from '~/utils/use-format-lokalize-percentage';

interface VaccineBoosterAdministrationsKpiSectionProps {
  source: string;
}

export function VaccineBoosterAdministrationsKpiSection({
  source,
}: VaccineBoosterAdministrationsKpiSectionProps) {
  const { formatPercentageAsNumber } = useFormatLokalizePercentage();

  const { siteText } = useIntl();

  const text = siteText.vaccinaties;

  const boosterAndThirdKpiText = text.booster_and_third_kpi;

  const totalBoosterAndThirdShots = {
    value: boosterAndThirdKpiText.total_booster_and_third_shots.value,
    description:
      boosterAndThirdKpiText.total_booster_and_third_shots.description,
    percentage: boosterAndThirdKpiText.total_booster_and_third_shots.percentage,
    percentageDescription:
      boosterAndThirdKpiText.total_booster_and_third_shots
        .percentage_description,
    warning: boosterAndThirdKpiText.total_booster_and_third_shots.warning,
    metadataDate: boosterAndThirdKpiText.metadata_date,
  };

  const boosterGgd = {
    value: boosterAndThirdKpiText.booster_ggd.value,
    title: boosterAndThirdKpiText.booster_ggd.title,
    metadataDate: boosterAndThirdKpiText.metadata_date,
  };

  const boosterEstimated = {
    value: boosterAndThirdKpiText.booster_estimated.value,
    title: boosterAndThirdKpiText.booster_estimated.title,
    metadataDate: boosterAndThirdKpiText.metadata_date,
  };

  const thirdGgd = {
    value: boosterAndThirdKpiText.third_ggd.value,
    title: boosterAndThirdKpiText.third_ggd.title,
    metadataDate: boosterAndThirdKpiText.metadata_date,
  };

  return (
    <Tile>
      <Box mb={20}>
        <TwoKpiSection>
          <Heading level={3}>{boosterAndThirdKpiText.title}</Heading>
          <Box />
        </TwoKpiSection>
      </Box>
      <TwoKpiSection>
        <Box spacing={3}>
          <KpiValue
            absolute={parseInt(
              totalBoosterAndThirdShots.value.replace(/\D/g, '')
            )}
          />
          <Text>{totalBoosterAndThirdShots.description}</Text>
          <Text fontWeight="bold">
            {replaceComponentsInText(
              totalBoosterAndThirdShots.percentageDescription,
              {
                percentage: (
                  <InlineText color="data.primary">
                    {`${formatPercentageAsNumber(
                      totalBoosterAndThirdShots.percentage
                    )}%`}
                  </InlineText>
                ),
              }
            )}
          </Text>
          {totalBoosterAndThirdShots.warning && (
            <Message variant="warning">
              {totalBoosterAndThirdShots.warning}
            </Message>
          )}
          <LokalizeMetadata
            date={totalBoosterAndThirdShots.metadataDate}
            source={source}
          />
        </Box>
        <Box spacing={4}>
          <BoosterAdministeredItem
            value={boosterGgd.value}
            description={boosterGgd.title}
            date={boosterGgd.metadataDate}
            source={source}
          />
          <BoosterAdministeredItem
            value={boosterEstimated.value}
            description={boosterEstimated.title}
            date={boosterEstimated.metadataDate}
            source={source}
          />
          <BoosterAdministeredItem
            value={thirdGgd.value}
            description={thirdGgd.title}
            date={thirdGgd.metadataDate}
            source={source}
          />
        </Box>
      </TwoKpiSection>
    </Tile>
  );
}

interface BoosterAdministeredProps {
  value: string;
  description: string;
  date: string;
  source: string;
}

function BoosterAdministeredItem(props: BoosterAdministeredProps) {
  const { value, description, date, source } = props;

  return (
    <Box spacing={1}>
      <Text fontWeight="bold">
        {replaceComponentsInText(description, {
          value: <InlineText color="data.primary">{value}</InlineText>,
        })}
      </Text>

      <LokalizeMetadata date={date} source={source} />
    </Box>
  );
}
