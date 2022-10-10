import { ReactNode } from 'react';
import styled from 'styled-components';
import { Text } from '~/components/typography';
import { space } from '~/style/theme';

interface TextWithIconProps {
  text: string;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
}

export const TextWithIcon = ({ icon, iconPlacement = 'right', text }: TextWithIconProps) => {
  return (
    <>
      {iconPlacement === 'left' && <Icon icon={icon} />}

      <Text>{text}</Text>

      {iconPlacement === 'right' && <Icon icon={icon} />}
    </>
  );
};

const Icon = ({ icon }: { icon: ReactNode }) => <IconSmall>{icon}</IconSmall>;

const IconSmall = styled.div`
  display: inline;
  text-decoration: inherit;
  margin: 0 ${space[1]};
  svg {
    width: 11px;
    height: 10px;
  }
`;
