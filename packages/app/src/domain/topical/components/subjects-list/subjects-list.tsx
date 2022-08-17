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
        {subjects.map((item) => (
          <li key={item.text}>
            <LinkWithIcon
              href={item.url}
              icon={<ArrowIconRight />}
              iconPlacement="right"
              isButton
            >
              {item.text}
            </LinkWithIcon>
          </li>
        ))}
      </ul>
    </Box>
  );
};
