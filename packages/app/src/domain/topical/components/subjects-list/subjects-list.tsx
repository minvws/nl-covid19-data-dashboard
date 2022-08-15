import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';
import { colors } from '@corona-dashboard/common';

interface Subject {
  text: string;
  url: string;
}

interface SubjectsListProps {
  label: string;
  label_mobile: string;
  subjects: Subject[];
  icon: ReactNode;
}

interface IconProps {
  icon: ReactNode;
  width: number;
  height: number;
  mr?: number | string;
}

export function SubjectsList({
  label,
  label_mobile,
  subjects,
  icon,
}: SubjectsListProps) {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  return breakpoints.sm ? (
    <Box
      display="flex"
      flex-direction="row"
      flex-wrap="wrap"
      alignItems="baseline"
      spacing={{ _: 3, md: 3 }}
      //gap='16px' // how to add gap?
    >
      <p>{label}</p>
      {subjects.map((item) => (
        <ButtonWithIcon type="button" key={item.text} as="a" href={item.url}>
          {item.text}
          <IconWrapper>
            <IconSmall icon={icon} width={11} height={10} />
          </IconWrapper>
        </ButtonWithIcon>
      ))}
    </Box>
  ) : (
    <Box
      display="flex"
      flex-direction="column"
      flex-wrap="wrap"
      alignItems="flex-start"
      spacing={1}
    >
      <p>{label_mobile}</p>
      <Box>
        {subjects.map((item) => (
          <LinkWithIcon
            key={item.text}
            href={item.url}
            icon={icon}
            iconPlacement="right"
          >
            {item.text}
          </LinkWithIcon>
        ))}
      </Box>
    </Box>
  );
}

const ButtonWithIcon = styled.button(
  css({
    bg: colors.lightBlue,
    border: 'none',
    borderRadius: '0px',
    color: colors.blue,
    px: 3,
    py: 12,
    cursor: 'pointer',

    '&:hover': {
      bg: colors.blue,
      color: colors.offWhite,
    },

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: colors.blue,
    },
  })
);

function IconSmall({ icon, width, height, mr }: IconProps) {
  return (
    <span css={css({ marginRight: mr, svg: { height, width, mx: '3px' } })}>
      {icon}
    </span>
  );
}

const IconWrapper = styled.span(
  css({
    display: 'inline-block',
    textDecoration: 'inherit',
  })
);
