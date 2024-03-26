import { Box } from '~/components/base';
import { colors } from '@corona-dashboard/common';
import { InlineText, Text } from '~/components/typography';
import React, { Fragment } from 'react';
import { ExternalLink } from '~/components/external-link';
import { replaceVariablesInText } from '~/utils';
import { External as ExternalLinkIcon } from '@corona-dashboard/icons';
import { space } from '~/style/theme';
import { MetadataIcon } from '~/components/metadata/components/items/metadata-icon';

interface MetadataItemProps {
  icon: JSX.Element;
  items: {
    text: string;
    href?: string;
  }[];
  label?: string;
  accessibilityText?: string;
  accessibilitySubject?: string;
  referenceLink?: string;
}

export function MetadataItem({ icon, label, items, referenceLink, accessibilityText, accessibilitySubject }: MetadataItemProps) {
  return (
    <Box display="flex" alignItems="flex-start" color={colors.gray7}>
      <MetadataIcon>{icon}</MetadataIcon>

      <Text variant="label1">
        {items && referenceLink && (
          <>
            {label && `${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.text}>
                <InlineText>
                  {index > 0 && (index !== items.length - 1 ? ' , ' : ' & ')}
                  {item.text}
                </InlineText>
              </Fragment>
            ))}
          </>
        )}
        {items && !referenceLink && (
          <>
            {label && `${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.text}>
                {index > 0 && ', '}
                {item.href && (
                  <ExternalLink
                    href={item.href}
                    underline="hover"
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
                    <ExternalLinkIcon width={space[3]} height={space[2]} />
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
