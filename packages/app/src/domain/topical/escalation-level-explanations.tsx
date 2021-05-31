import css from '@styled-system/css';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { EscalationLevelInfoLabel } from '~/components/escalation-level';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { EscalationLevel } from '../restrictions/type';
import { CollapsibleButton } from '~/components/collapsible';

type EscalationLevelExplanationProps = {
  level: EscalationLevel;
  explanation: string;
};

function EscalationLevelExplanation(props: EscalationLevelExplanationProps) {
  const { level, explanation } = props;

  if (explanation === '') return null;

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
  const { siteText } = useIntl();

  return (
    <Box px={{ md: 5, lg: '8rem' }}>
      <CollapsibleButton label={siteText.escalatie_niveau.tile_title}>
        <Box py={3} px={{ _: 3, xs: 4 }}>
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
          <EscalationLevelExplanation
            level={null}
            explanation={siteText.escalatie_niveau.types.onbekend.toelichting}
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
    </Box>
  );
}
