import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import DownloadIcon from '~/assets/download.svg';
import siteText from '~/locale/index';
import theme from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from './base';
import { ExternalLink } from './external-link';
import { Text } from './typography';

export interface IDatasource {
  href: string;
  text: string;
  download: string;
}

export interface IWeekRange {
  weekStartUnix: number;
  weekEndUnix: number;
}

export interface IContentHeaderMetadataProps {
  dataSources: IDatasource[];
  datumsText: string;
  dateInfo: number | IWeekRange;
  dateOfInsertionUnix: number;
}

const text = siteText.common.metadata;

export function Metadata(props: IContentHeaderMetadataProps) {
  const { dataSources, datumsText, dateInfo, dateOfInsertionUnix } = props;

  let dateText = '';
  if (typeof dateInfo === 'number') {
    const dateOfReport = formatDateFromSeconds(dateInfo, 'weekday-medium');
    const dateOfInsertion = dateOfInsertionUnix
      ? formatDateFromSeconds(dateOfInsertionUnix, 'weekday-medium')
      : undefined;
    dateText = replaceVariablesInText(datumsText, {
      dateOfReport,
      dateOfInsertion,
    });
  } else {
    const weekStart = formatDateFromSeconds(
      dateInfo.weekStartUnix,
      'weekday-medium'
    );
    const weekEnd = formatDateFromSeconds(
      dateInfo.weekEndUnix,
      'weekday-medium'
    );
    const dateOfInsertion = formatDateFromSeconds(
      dateOfInsertionUnix,
      'weekday-medium'
    );
    dateText = replaceVariablesInText(datumsText, {
      weekStart,
      weekEnd,
      dateOfInsertion,
    });
  }

  const dataDownloads = dataSources
    .filter((ds) => Boolean(ds.download.trim()))
    .map((ds) => ({ href: ds.download, text: ds.text }));

  return (
    <Box>
      <Box
        display="flex"
        alignItems="flex-start"
        color="annotation"
        my={3}
        mx={0}
      >
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
            width="14"
            height="14"
          />
        }
        items={dataDownloads}
        label={text.download}
      />
    </Box>
  );
}

interface IMetadataItemProps {
  icon: JSX.Element;
  label: string;
  items: {
    href: string;
    text: string;
  }[];
}

function MetadataItem(props: IMetadataItemProps) {
  const { icon, label, items } = props;

  if (!items.length) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      color="annotation"
      my={3}
      mx={0}
    >
      <Box as="span" minWidth="1.8rem" mt={1}>
        {icon}
      </Box>
      <Text margin={0}>
        {label}:{' '}
        {items.map((item, index) => {
          if (index) {
            return (
              <>
                {' '}
                &amp;{' '}
                <ExternalLink
                  href={item.href}
                  text={item.text}
                  key={`label_${index}_${item.href}`}
                />
              </>
            );
          }
          return (
            <ExternalLink
              href={item.href}
              text={item.text}
              key={`label_${index}_${item.href}`}
            />
          );
        })}
      </Text>
    </Box>
  );
}
