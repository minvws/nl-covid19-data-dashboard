import { Fragment } from 'react';
import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import DownloadIcon from '~/assets/download.svg';
import siteText from '~/locale/index';
import theme from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from '../base';
import { ExternalLink } from '../external-link';
import { Text } from '../typography';
import css from '@styled-system/css';

interface Datasource {
  href: string;
  text: string;
  download: string;
}

interface DateRange {
  start: number;
  end: number;
}

export interface MetadataProps {
  dataSources: Datasource[];
  datumsText: string;
  dateOrRange: number | DateRange;
  dateOfInsertionUnix: number;
}

const text = siteText.common.metadata;

export function Metadata(props: MetadataProps) {
  const { dataSources, datumsText, dateOrRange, dateOfInsertionUnix } = props;

  const dateText = formateDateText(
    dateOrRange,
    dateOfInsertionUnix,
    datumsText
  );

  const dataDownloads = dataSources
    .filter((x) => Boolean(x.download.trim()))
    .map((x) => ({ href: x.download, text: x.text }));

  return (
    <Box spacing={2}>
      <Box display="flex" alignItems="flex-start" color="annotation">
        <Box as="span" minWidth="1.8rem" mt={1}>
          <ClockIcon aria-hidden color={theme.colors.annotation} />
        </Box>
        <Text margin={0}>{dateText}</Text>
      </Box>

      <MetadataItem
        icon={<DatabaseIcon aria-hidden />}
        items={dataSources}
        label={text.source}
      />

      <MetadataItem
        icon={
          <DownloadIcon
            aria-hidden
            color={theme.colors.annotation}
            width="1em"
            height="1em"
          />
        }
        items={dataDownloads}
        label={text.download}
      />
    </Box>
  );
}

interface MetadataItemProps {
  icon: JSX.Element;
  label: string;
  items: {
    href: string;
    text: string;
  }[];
}

function MetadataItem(props: MetadataItemProps) {
  const { icon, label, items } = props;

  if (!items.length) {
    return null;
  }

  return (
    <Box display="flex" alignItems="flex-start" color="annotation">
      <Box as="span" minWidth="1.8rem" mt={1}>
        {icon}
      </Box>
      <Text margin={0}>
        {label}:{' '}
        {items.map((item, index) => (
          <Fragment key={index + item.href}>
            {index > 0 && ' & '}
            {item.href && (
              <ExternalLink href={item.href}>{item.text}</ExternalLink>
            )}
            {!item.href && (
              <Text
                css={css({
                  display: 'inline-block',
                  my: '0',
                  fontSize: 'inherit',
                })}
              >
                {item.text}
              </Text>
            )}
          </Fragment>
        ))}
      </Text>
    </Box>
  );
}

function formateDateText(
  dateOrRange: number | DateRange,
  dateOfInsertionUnix: number,
  datumsText: string
) {
  if (typeof dateOrRange === 'number') {
    const dateOfReport = formatDateFromSeconds(dateOrRange, 'weekday-medium');
    const dateOfInsertion = formatDateFromSeconds(
      dateOfInsertionUnix,
      'weekday-medium'
    );
    return replaceVariablesInText(datumsText, {
      dateOfReport,
      dateOfInsertion,
    });
  } else {
    const weekStart = formatDateFromSeconds(
      dateOrRange.start,
      'weekday-medium'
    );
    const weekEnd = formatDateFromSeconds(dateOrRange.end, 'weekday-medium');
    const dateOfInsertion = formatDateFromSeconds(
      dateOfInsertionUnix,
      'weekday-medium'
    );
    return replaceVariablesInText(datumsText, {
      weekStart,
      weekEnd,
      dateOfInsertion,
    });
  }
}
