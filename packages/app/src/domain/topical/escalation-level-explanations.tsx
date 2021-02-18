import css from '@styled-system/css';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { Collapsible } from '~/components-styled/collapsible';
import { EscalationLevelInfoLabel } from '~/components-styled/escalation-level';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { EscalationLevel } from '../restrictions/type';

type EscalationLevelExplanationProps = {
  level: EscalationLevel;
  explanation: string;
};

function EscalationLevelExplanation(props: EscalationLevelExplanationProps) {
  const { level, explanation } = props;
  return (
    <Box display="flex" flexDirection={{ _: 'column', md: 'row' }}>
      <Box width="10rem" display="flex" flexGrow={0} flexShrink={0}>
        <EscalationLevelInfoLabel level={level} />
      </Box>
      <Text css={css({ maxWidth: 'maxWidthText' })}>{explanation}</Text>
    </Box>
  );
}

export function EscalationLevelExplanations() {
  return (
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
          <LinkWithIcon
            href="/over-risiconiveaus"
            icon={<ArrowIconRight />}
            iconPlacement="right"
          >
            {siteText.escalatie_niveau.lees_meer}
          </LinkWithIcon>
        </Box>
      </Box>
    </Collapsible>
  );
}
