import { css } from '@styled-system/css';
import { Box } from '~/components/base';
import { ArrowIconRight } from '~/components/arrow-icon';
import { useBreakpointsAsync } from '~/utils/use-breakpoints';
import { LinkWithIcon } from '~/components/link-with-icon';

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

export const SubjectsList = ({
  label,
  label_mobile,
  subjects,
}: SubjectsListProps) => {
  const breakpoints = useBreakpointsAsync();

  // Prevents flickering; don't show anything until breakpoints are loaded
  if (!breakpoints) {
    return null;
  }

  // return (
  //   <Box
  //     display="flex"
  //     flexDirection={breakpoints.sm ? 'row' : 'column'}
  //     alignItems={breakpoints.sm ? 'center' : 'flex-start'}
  //     spacing={3}
  //   >
  //     <p id={label_mobile} style={{ margin: 0 }}>
  //       {breakpoints.sm ? label : label_mobile}
  //     </p>
  //     <ul
  //       aria-labelledby={label}
  //       css={css({
  //         display: breakpoints.sm ? 'flex' : 'block',
  //         listStyle: 'none',
  //         m: 0,
  //         p: 0,
  //       })}
  //     >
  //       {subjects.map((subject) => (
  //         <li key={subject.text} css={css({ ml: breakpoints.sm ? 3 : 0 })}>
  //           <LinkWithIcon
  //             href={subject.url}
  //             icon={<ArrowIconRight />}
  //             iconPlacement="right"
  //             hasButtonStyling={breakpoints.sm}
  //           >
  //             {subject.text}
  //           </LinkWithIcon>
  //         </li>
  //       ))}
  //     </ul>
  //   </Box>
  // );

  return !breakpoints.sm ? (
    <SubjectsListSmall label={label_mobile} subjects={subjects} />
  ) : (
    <SubjectsListLarge label={label} subjects={subjects} />
  );
};

const SubjectsListSmall = ({ label, subjects }: SubjectsListSmallProps) => {
  return (
    <Box display="flex" flexDirection="column" spacing={3}>
      <p id={label}>{label}</p>
      <ul aria-labelledby={label} css={css({ listStyle: 'none', m: 0, p: 0 })}>
        {subjects.map((subject, index) => (
          <li
            key={subject.text}
            css={css({ mb: subjects.length - 1 === index ? 0 : 2 })}
          >
            <LinkWithIcon
              href={subject.url}
              icon={<ArrowIconRight />}
              iconPlacement="right"
            >
              {subject.text}
            </LinkWithIcon>
          </li>
        ))}
      </ul>
    </Box>
  );
};

const SubjectsListLarge = ({ label, subjects }: SubjectsListLargeProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="baseline"
      spacing={3}
    >
      <p id={label}>{label}</p>
      <ul
        aria-labelledby={label}
        css={css({ display: 'flex', listStyle: 'none', m: 0, p: 0 })}
      >
        {subjects.map((subject) => (
          <li key={subject.text} css={css({ ml: 3 })}>
            <LinkWithIcon
              href={subject.url}
              icon={<ArrowIconRight />}
              iconPlacement="right"
              hasButtonStyling
            >
              {subject.text}
            </LinkWithIcon>
          </li>
        ))}
      </ul>
    </Box>
  );
};
