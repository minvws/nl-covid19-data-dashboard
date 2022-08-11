import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';

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
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  return (
    <>
      {breakpoints.sm ? (
        <>
          <SubjectsTitle title="Meer onderwerpen:" />
          <Box
            display="flex-start"
            flex-wrap="wrap"
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
        </>
      ) : (
        <>
          <Box flex-direction="row" display="grid" spacing={{ _: 1, sm: 0 }}>
            <SubjectsTitle title="Meer onderwerpen:" />
            <Box display="grid" spacing={{ _: 1, sm: 0 }}>
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
        </>
      )}
    </>
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
    margin: '16px',

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
