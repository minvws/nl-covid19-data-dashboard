import { Heading, Text } from '~/components/typography';
import { Content } from '~/domain/layout/content';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const ErrorPage = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.error_metadata} lastGenerated={lastGenerated}>
      <Content>
        <Heading level={1}>{siteText.error_titel.text}</Heading>
        <Text>{siteText.error_beschrijving.text}</Text>
      </Content>
    </Layout>
  );
};

export default ErrorPage;
