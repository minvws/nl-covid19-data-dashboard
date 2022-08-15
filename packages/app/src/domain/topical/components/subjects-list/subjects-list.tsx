import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ArrowIconRight } from '~/components/arrow-icon';
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
}

interface SubjectsListSmallProps {
  label: string;
  subjects: Subject[];
}

interface SubjectsListLargeProps {
  label: string;
  subjects: Subject[];
}

interface IconProps {
  width: number;
  height: number;
  mr?: number | string;
}

export function SubjectsList({
  label,
  label_mobile,
  subjects,
}: SubjectsListProps) {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  return !breakpoints.sm ? (
    <SubjectsListSmall label={label_mobile} subjects={subjects} />
  ) : (
    <SubjectsListLarge label={label} subjects={subjects} />
  );
}

const ButtonWithIcon = styled.a`
  background-color: ${colors.lightBlue};
  border: none;
  border-radius: 0px;
  color: ${colors.blue};
  padding: 12px ${({ theme }) => theme.space[3]};
  cursor: pointer;

  &:hover {
    background-color: ${colors.blue};
    color: ${colors.offWhite};
  }

  &:focus {
    outline-width: 1px;
    outline-style: dashed;
    outline-color: ${colors.blue};
  }
`;

function SubjectsListSmall({ label, subjects }: SubjectsListSmallProps) {
  return (
    <Box display="flex" flexDirection="column" spacing={3}>
      <p id={label}>{label}</p>
      <Box display="flex" flexDirection="column" spacing={1}>
        <ul
          aria-labelledby={label}
          css={css({ listStyle: 'none', m: 0, p: 0 })}
        >
          {subjects.map((item) => (
            <li key={item.text}>
              <LinkWithIcon
                href={item.url}
                icon={<ArrowIconRight />}
                iconPlacement="right"
              >
                {item.text}
              </LinkWithIcon>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

function SubjectsListLarge({ label, subjects }: SubjectsListLargeProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="baseline"
      spacing={3}
      //gap='16px' // how to add gap?
    >
      <p>{label}</p>
      {subjects.map((item) => (
        <ButtonWithIcon key={item.text} href={item.url}>
          {item.text}
          <IconWrapper>
            <IconSmall width={11} height={10} />
          </IconWrapper>
        </ButtonWithIcon>
      ))}
    </Box>
  );
}

function IconSmall({ width, height, mr }: IconProps) {
  return (
    <span css={css({ marginRight: mr, svg: { height, width, mx: '3px' } })}>
      <ArrowIconRight />
    </span>
  );
}

const IconWrapper = styled.span(
  css({
    display: 'inline-block',
    textDecoration: 'inherit',
    // px: 3,
    // px: 3,
  })
);
