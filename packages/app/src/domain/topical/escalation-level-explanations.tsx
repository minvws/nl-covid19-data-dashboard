import css from '@styled-system/css';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { EscalationLevelInfoLabel } from '~/components-styled/escalation-level';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { EscalationLevel } from '../restrictions/type';
import { CollapsibleButton } from '~/components-styled/collapsible';

type EscalationLevelExplanationProps = {
  level: EscalationLevel;
  explanation: string;
};

function EscalationLevelExplanation(props: EscalationLevelExplanationProps) {
  const { level, explanation } = props;
  return (
    <Box display="flex" flexDirection={{ _: 'column', md: 'row' }} py={3}>
      <Box width="10rem" display="flex" flexGrow={0} flexShrink={0}>
        <EscalationLevelInfoLabel level={level} />
      </Box>
      <Text mb={0} css={css({ maxWidth: 'maxWidthText' })}>
        {explanation}
      </Text>
    </Box>
  );
}

export function EscalationLevelExplanations() {
  return (
    <CollapsibleButton label={siteText.escalatie_niveau.tile_title}>
      <Box my={3} px={{ _: 3, xs: 4, md: 5, lg: '12rem' }}>
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
        <Box my={4}>
          <LinkWithIcon
            href="/over-risiconiveaus"
            icon={<ArrowIconRight />}
            iconPlacement="right"
          >
            {siteText.escalatie_niveau.lees_meer}
          </LinkWithIcon>
        </Box>
      </Box>
    </CollapsibleButton>
  );
}
