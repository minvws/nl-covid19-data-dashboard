import { Warning } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { Box, Spacer } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { useCollapsible } from '~/utils/use-collapsible';
import { InlineText, BoldText } from './typography';

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
                as="button"
                css={css({
                  cursor: 'pointer',
                  border: 0,
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                  mt: 1,
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
