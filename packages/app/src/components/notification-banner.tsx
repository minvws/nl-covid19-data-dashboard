import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Box, Spacer } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { useCollapsible } from '~/utils/use-collapsible';
import { InlineText } from './typography';

interface NotificationBannerProps {
  title: string;
  description: string;
}
export function NotificationBanner({
  title,
  description,
}: NotificationBannerProps) {
  const [lastWord, ...splittedWords] = title.split(' ').reverse();
  const titleWithoutLastWord = splittedWords.reverse().join(' ');

  const collapsible = useCollapsible();

  const hasDescription = description.length !== 0;

  return (
    <Box width="100%" backgroundColor="warningYellow">
      <MaxWidth
        px={{ _: 3, sm: 4 }}
        py={3}
        display="flex"
        spacingHorizontal={3}
      >
        <Box display="flex" minWidth="1.6rem">
          <Warning fill="black" />
        </Box>

        <Box maxWidth="maxWidthText">
          {hasDescription ? (
            collapsible.button(
              <Box
                spacingHorizontal={2}
                display="flex"
                alignItems="center"
                css={css({
                  cursor: 'pointer',
                })}
              >
                <InlineText fontWeight="bold">
                  {titleWithoutLastWord}{' '}
                  <Box display="inline-flex" position="relative">
                    <InlineText>
                      {lastWord}
                      {collapsible.chevron}
                    </InlineText>
                  </Box>
                </InlineText>
              </Box>
            )
          ) : (
            <InlineText fontWeight="bold">{title}</InlineText>
          )}

          {hasDescription &&
            collapsible.content(
              <Box pb={2}>
                <Spacer mt={3} />
                <Markdown content={description} />
              </Box>
            )}
        </Box>
      </MaxWidth>
    </Box>
  );
}
