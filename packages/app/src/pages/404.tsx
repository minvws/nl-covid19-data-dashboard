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

const NotFound = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();

  return (
    <Layout {...commonTexts.notfound_metadata} lastGenerated={lastGenerated}>
      <Content>
        <Heading level={1}>{commonTexts.notfound_titel.text}</Heading>
        <Text>{commonTexts.notfound_beschrijving.text}</Text>
      </Content>
    </Layout>
  );
};

export default NotFound;
