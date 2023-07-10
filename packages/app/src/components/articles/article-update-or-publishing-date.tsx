import { colors } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { ArticleMainCategory, ArticlePublishedDate, ArticleUpdatedDate } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Box } from '../base/box';
import { PublicationDate } from '../publication-date';
import { InlineText } from '../typography';
import { getDateToUse } from './logic/get-date-to-use';

interface ArticlePublishingDateProps {
  mainCategory: ArticleMainCategory | null;
  publishedDate: ArticlePublishedDate;
  updatedDate: ArticleUpdatedDate;
}

export const ArticleUpdateOrPublishingDate = ({ publishedDate, updatedDate, mainCategory }: ArticlePublishingDateProps) => {
  const { commonTexts } = useIntl();
  const { publishedOrUpdatedDate, isUpdatedAfterPublishing } = getDateToUse(publishedDate, updatedDate, mainCategory);

  if (isUpdatedAfterPublishing) {
    return (
      <Box color={colors.gray8} display="flex">
        <span>
          {replaceComponentsInText(commonTexts.article_teaser.articles_updated_date, {
            date: <PublicationDate date={publishedOrUpdatedDate} />,
          })}
        </span>
      </Box>
    );
  }

  return (
    <InlineText color={colors.gray8}>
      <PublicationDate date={publishedOrUpdatedDate} />
    </InlineText>
  );
};
