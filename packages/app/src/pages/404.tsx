import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { ContentLayout } from '~/domain/layout/content-layout'

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const NotFound = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.notfound_metadata} lastGenerated={lastGenerated}>
<ContentLayout>
          <Heading level={1}>{siteText.error_titel.text}</Heading>
          <Text>{siteText.error_beschrijving.text}</Text>
        </Box>
        </ContentLayout>
    </Layout>
  );
};

export default NotFound;
