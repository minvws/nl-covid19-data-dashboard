import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

interface SubjectsTitleProps {
  title: string;
}

interface Subject {
  text: string;
  url: string;
}

interface SubjectListProps {
  subjects: Subject[];
  icon: ReactNode;
}

interface IconProps {
  icon: ReactNode;
  isSingleWord?: boolean;
  width: number;
  height: number;
  mr?: number | string;
}

export function SubjectsTitle({ title }: SubjectsTitleProps) {
  return <p>{title}</p>;
}

export function SubjectList({ subjects, icon }: SubjectListProps) {
  return (
    <Box
      display="flex-start"
      gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      css={css({
        // Same value to be aligned with the footer grid
        columnGap: asResponsiveArray({ md: '16px' }),
      })}
      spacing={{ _: 3, md: 0 }}
    >
      {subjects.map((item) => (
        <Button type="button" key={item.text} as="a" href={item.url}>
          {item.text}
          <IconWrapper>
            <IconSmall icon={icon} width={11} height={10} />
          </IconWrapper>
        </Button>
      ))}
    </Box>
  );
}

const Button = styled.button<{ isActive?: boolean }>(({ isActive }) =>
  css({
    bg: !isActive ? 'lightBlue' : 'transparant',
    border: 'none',
    borderRadius: '0px',
    color: !isActive ? 'blue' : 'blue',
    px: !isActive ? 3 : 0,
    py: !isActive ? 12 : 0,
    cursor: 'pointer',
    margin: '1em',
    padding: '1em',

    '&:hover': {
      bg: 'blue',
      color: !isActive ? 'offWhite' : 'blue',
    },

    '&:focus': {
      outline: '2px dotted',
      outlineColor: 'blue',
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
