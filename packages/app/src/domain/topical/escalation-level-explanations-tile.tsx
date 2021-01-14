import { Box } from '~/components-styled/base';
import { Collapsible } from '~/components-styled/collapsible';
import { EscalationLevelInfoLabel } from '~/components-styled/escalation-level';
import { ReadMoreLink } from '~/components-styled/read-more-link';
import { Tile } from '~/components-styled/tile';
import { Text } from '~/components-styled/typography';
import { EscalationLevel } from '~/components/restrictions/type';
import siteText from '~/locale';

type EscalationLevelExplanationProps = {
  level: EscalationLevel;
  explanation: string;
};

function EscalationLevelExplanation(props: EscalationLevelExplanationProps) {
  const { level, explanation } = props;
  return (
    <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
      <Box width="10rem" display="flex" flexGrow={0} flexShrink={0}>
        <EscalationLevelInfoLabel escalationLevel={level} />
      </Box>
      <Text>{explanation}</Text>
    </Box>
  );
}

export function EscalationLevelExplanationsTile() {
  return (
    <Tile>
      <Collapsible summary={siteText.escalatie_niveau.tile_title} hideBorder>
        <Box my={3}>
          <EscalationLevelExplanation
            level={1}
            explanation={siteText.escalatie_niveau.types['1'].toelichting}
          />
          <EscalationLevelExplanation
            level={2}
            explanation={siteText.escalatie_niveau.types['2'].toelichting}
          />
          <EscalationLevelExplanation
            level={3}
            explanation={siteText.escalatie_niveau.types['3'].toelichting}
          />
          <EscalationLevelExplanation
            level={4}
            explanation={siteText.escalatie_niveau.types['4'].toelichting}
          />
          <Box mt={4}>
            <ReadMoreLink
              route="/over-risiconiveaus"
              text={siteText.escalatie_niveau.lees_meer}
            />
          </Box>
        </Box>
      </Collapsible>
    </Tile>
  );
}
