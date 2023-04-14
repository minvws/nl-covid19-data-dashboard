import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';
import { Box } from '../base/box';
import DynamicIcon, { IconName } from '../get-icon-by-name';
import { Anchor } from '../typography';
import { NotFoundLinkProps } from './types';

export const NotFoundLink = ({ link: { linkUrl, linkLabel, linkIcon }, hasChevron, isCTA, ...restProps }: NotFoundLinkProps) => {
  const iconNameFromFileName = linkIcon ? (getFilenameToIconName(linkIcon) as IconName) : null;
  const icon = iconNameFromFileName ? <DynamicIcon color={colors.blue8} name={iconNameFromFileName} height="30px" width="30px" /> : undefined;

  return (
    <Box {...restProps}>
      {icon}

      <StyledAnchor hasIcon={!!icon} href={linkUrl} isCTA={isCTA} underline={!isCTA}>
        {linkLabel}
      </StyledAnchor>

      {hasChevron && <ChevronRight color={colors.blue8} height="10px" />}
    </Box>
  );
};

interface StyledAnchorProps {
  hasIcon: boolean;
  isCTA: boolean | undefined;
}

const StyledAnchor = styled(Anchor)<StyledAnchorProps>`
  margin-inline: ${({ hasIcon, isCTA }) => (hasIcon || isCTA ? space[2] : !hasIcon ? `0 ${space[2]}` : 0)};

  &:hover {
    text-decoration: none;
  }
`;
