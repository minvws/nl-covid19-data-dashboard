import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ArrowIconRight } from '~/components/arrow-icon';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Text } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';

interface Subject {
  text: string;
  url: string;
}

interface SubjectsListProps {
  labelLong: string;
  labelShort: string;
  subjects: Subject[];
}

export const SubjectsList = ({
  labelLong,
  labelShort,
  subjects,
}: SubjectsListProps) => {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', sm: 'row' }}
      alignItems={{ _: 'flex-start', sm: 'baseline' }}
      spacing={{ _: 3, sm: 0 }}
    >
      <Text
        id={labelLong}
        css={css({
          flex: asResponsiveArray({ sm: '0 0 17.5%', md: '0 0 12.5%' }),
        })}
      >
        {breakpoints.sm ? labelShort : labelLong}
      </Text>
      <ul
        aria-labelledby={labelLong}
        css={css({
          display: asResponsiveArray({ sm: 'flex' }),
          flex: asResponsiveArray({ sm: '0 0 82.5%', md: '0 0 87.5%' }),
          flexWrap: 'wrap',
          listStyle: 'none',
          m: 0,
          p: 0,
        })}
      >
        {subjects.map((subject, index) => (
          <li
            key={subject.text}
            css={css({
              mb: asResponsiveArray({
                _: subjects.length - 1 === index ? 0 : 2,
                sm: 4,
              }),
              mr: asResponsiveArray({
                sm: subjects.length - 1 === index ? 0 : 3,
              }),
            })}
          >
            <LinkWithIcon
              href={subject.url}
              icon={<ArrowIconRight />}
              iconPlacement="right"
              hasButtonStyling={breakpoints.sm}
            >
              {subject.text}
            </LinkWithIcon>
          </li>
        ))}
      </ul>
    </Box>
  );
};
