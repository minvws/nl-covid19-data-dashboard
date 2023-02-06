import { colors } from '@corona-dashboard/common';
import scrollIntoView from 'scroll-into-view-if-needed';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Anchor } from '~/components/typography';
import { fontWeights, mediaQueries, space } from '~/style/theme';
import { BehaviorIdentifier } from '../logic/behavior-types';
import { BehaviorIcon } from './behavior-icon';

type ScrollRef = { current: HTMLDivElement | null };

export type OnClickConfig = {
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: ScrollRef;
};

interface BehaviorIconWithLabelProps {
  id: BehaviorIdentifier;
  description: string;
  onClickConfig: OnClickConfig;
}

export const BehaviorIconWithLabel = ({ id, description, onClickConfig }: BehaviorIconWithLabelProps) => {
  const anchorButtonClickHandler = (id: BehaviorIdentifier, scrollRef: ScrollRef) => {
    scrollIntoView(scrollRef.current as Element);
    onClickConfig.setCurrentId(id);
  };

  return (
    <Box display="flex" alignItems="center">
      <Box minWidth={space[4]} color={colors.black} paddingRight={space[2]} display="flex">
        <BehaviorIcon name={id} size="25px" />
      </Box>

      <BehaviorAnchor as="button" underline="hover" color={colors.black} onClick={() => anchorButtonClickHandler(id, onClickConfig.scrollRef)}>
        <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
          {description}
        </Box>
      </BehaviorAnchor>
    </Box>
  );
};

const BehaviorAnchor = styled(Anchor)`
  span {
    font-weight: ${fontWeights.bold};

    @media ${mediaQueries.lg} {
      font-weight: ${fontWeights.normal};
    }
  }

  &:hover {
    color: ${colors.blue8};
  }
`;
