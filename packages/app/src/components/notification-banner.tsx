import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Box, Spacer } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { useCollapsible } from '~/utils/use-collapsible';
import { InlineText, BoldText } from './typography';
import { colors } from '@corona-dashboard/common';
import { space, sizes } from '~/style/theme';

interface NotificationBannerProps {
  title: string;
  description: string;
}
export function NotificationBanner({ title, description }: NotificationBannerProps) {
  const [lastWord, ...splittedWords] = title.split(' ').reverse();
  const titleWithoutLastWord = splittedWords.reverse().join(' ');

  const collapsible = useCollapsible();

  const hasDescription = description.length !== 0;

  return (
    <Box width="100%" backgroundColor={colors.gray2}>
      <MaxWidth paddingY={space[3]}>
        <Box paddingX={{ _: space[3], sm: space[4] }} maxWidth={sizes.maxWidthSiteWarning} display="flex" alignItems="flex-start" spacingHorizontal={3}>
          <Box display="flex" minWidth="1.6rem" minHeight="1.6rem">
            <Warning />
          </Box>

          {hasDescription ? (
            collapsible.button(
              <Box
                spacingHorizontal={2}
                display="flex"
                alignItems="center"
                as="button"
                css={css({
                  color: colors.black,
                  cursor: 'pointer',
                  border: 0,
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  padding: '0',
                  margin: '0',
                  textAlign: 'left',
                  marginTop: space[1],
                })}
              >
                <BoldText>
                  {titleWithoutLastWord}{' '}
                  <Box display="inline-flex" position="relative">
                    <InlineText>
                      {lastWord}
                      {collapsible.chevron}
                    </InlineText>
                  </Box>
                </BoldText>
              </Box>
            )
          ) : (
            <BoldText>{title}</BoldText>
          )}

          {hasDescription &&
            collapsible.content(
              <Box paddingBottom={space[2]}>
                <Spacer marginTop={space[3]} />
                <Markdown content={description} />
              </Box>
            )}
        </Box>
      </MaxWidth>
    </Box>
  );
}
