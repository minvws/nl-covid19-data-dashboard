import React, { Fragment } from 'react';
import { useIntl } from '~/intl';
import { Box } from '~/components/base';
import { Link } from '~/utils/link';
import { Anchor } from '~/components/typography';
import css from '@styled-system/css';
import { ChevronRight } from '@corona-dashboard/icons';
import { MetadataIcon } from '~/components/metadata/components/items/metadata-icon';

interface MetadataReferenceProps {
  icon: React.ReactNode;
  referenceLink: string;
}

export function MetadataReference({ icon, referenceLink }: MetadataReferenceProps) {
  const { commonTexts } = useIntl();

  const words = commonTexts.informatie_header.meer_informatie_link.split(' ');

  return (
    <Box display="flex" alignItems="flex-start" color="gray7">
      <MetadataIcon>{icon}</MetadataIcon>

      <Link href={referenceLink} passHref>
        <Anchor underline="hover" variant="label1">
          {words.map((word, index) => (
            <Fragment key={index}>
              {words.length - 1 === index ? (
                <span
                  css={css({
                    display: 'inline-block',
                    textDecoration: 'inherit',
                  })}
                >
                  {word}&nbsp;
                  <ChevronRight width="10px" height="10px" />
                </span>
              ) : (
                <span>{`${word} `}</span>
              )}
            </Fragment>
          ))}
        </Anchor>
      </Link>
    </Box>
  );
}
