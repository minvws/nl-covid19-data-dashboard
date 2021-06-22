import { Fragment } from 'react';
import styled from 'styled-components';
import ClockIcon from '~/assets/clock.svg';
import DatabaseIcon from '~/assets/database.svg';
import DownloadIcon from '~/assets/download.svg';
import MeerInformatieIcon from '~/assets/meer-informatie.svg';
import { useIntl } from '~/intl';
import theme from '~/style/theme';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from '../base';
import { ExternalLink } from '../external-link';
import { InlineText, Text } from '../typography';

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
  accessibilitySubject?: string;
  moreInformationLabel?: string;
  moreInformationLink?: {
    href: string;
    text: string;
  };
  reference?: {
    href: string;
    text: string;
  };
}

function useFormateDateText(
  dateOrRange: number | DateRange,
  dateOfInsertionUnix: number,
  datumsText: string
) {
  const { formatDateFromSeconds } = useIntl();

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

export function Metadata({
  dataSources,
  datumsText,
  dateOrRange,
  dateOfInsertionUnix,
  accessibilitySubject,
  moreInformationLabel,
  moreInformationLink,
  reference,
}: MetadataProps) {
  const { siteText } = useIntl();
  const text = siteText.common.metadata;

  const dateText = useFormateDateText(
    dateOrRange,
    dateOfInsertionUnix,
    datumsText
  );

  const dataDownloads = dataSources
    .filter((x) => Boolean(x.download.trim()))
    .map((x) => ({ href: x.download, text: x.text }));

  return (
    <Box spacing={2} mb={3}>
      <Box display="flex" alignItems="flex-start" color="annotation">
        <Box as="span" minWidth="1.8rem" mt={1}>
          <ClockIcon aria-hidden color={theme.colors.annotation} />
        </Box>
        <Text margin={0}>{dateText}</Text>
      </Box>

      <MetadataItem
        icon={<DatabaseIcon aria-hidden />}
        items={dataSources}
        label={reference ? 'Bron' : text.source}
        accessibilityText={siteText.accessibility.text_source}
        accessibilitySubject={accessibilitySubject}
        reference={reference}
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
        label={reference ? 'Bron' : text.download}
        accessibilityText={siteText.accessibility.text_download}
        accessibilitySubject={accessibilitySubject}
        reference={reference}
      />

      {reference && (
        <MetadataItem
          icon={
            <DownloadIcon
              aria-hidden
              color={theme.colors.annotation}
              width="1em"
              height="1em"
            />
          }
          reference={reference}
        />
      )}

      {moreInformationLabel && (
        <MetadataItem
          icon={<MeerInformatieIcon aria-hidden />}
          items={moreInformationLink ? [moreInformationLink] : []}
          label={moreInformationLabel}
        />
      )}
    </Box>
  );
}

interface MetadataItemProps {
  icon: JSX.Element;
  label?: string;
  items?: {
    href: string;
    text: string;
  }[];
  accessibilityText?: string;
  accessibilitySubject?: string;
  reference?: {
    href: string;
    text: string;
  };
}

function MetadataItem({
  icon,
  label,
  items,
  reference,
  accessibilityText,
  accessibilitySubject,
}: MetadataItemProps) {
  return (
    <Box display="flex" alignItems="flex-start" color="annotation">
      <Box as="span" minWidth="1.8rem" mt={1}>
        {icon}
      </Box>

      <Text margin={0}>
        {reference && !items && (
          <Link href={reference.href} passHref>
            <Anchor>{reference.text}</Anchor>
          </Link>
        )}

        {items && reference && (
          <>
            {`${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.href}>
                <InlineText>
                  {index > 0 && ' & '}
                  {item.text}
                </InlineText>
              </Fragment>
            ))}
          </>
        )}

        {items && !reference && (
          <>
            {`${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.href}>
                {index > 0 && ' & '}
                {item.href && (
                  <ExternalLink
                    href={item.href}
                    ariaLabel={
                      accessibilityText && accessibilitySubject
                        ? replaceVariablesInText(accessibilityText, {
                            subject: accessibilitySubject,
                            source: item.text,
                          })
                        : undefined
                    }
                  >
                    {item.text}
                  </ExternalLink>
                )}
                {!item.href && item.text}
              </Fragment>
            ))}
          </>
        )}
      </Text>
    </Box>
  );
}

const Anchor = styled.a({
  textDecoration: 'none',

  '&:hover': {
    textDecoration: 'underline',
  },
});
