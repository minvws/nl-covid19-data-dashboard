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
  const { commonTexts } = useIntl();

  return (
    <Layout {...commonTexts.error_metadata} lastGenerated={lastGenerated}>
      <Content>
        <Heading level={1}>{commonTexts.error_titel.text}</Heading>
        <Text>{commonTexts.error_beschrijving.text}</Text>

        <button
          onClick={() => {
            location.reload();
          }}
        >
          {commonTexts.error_probeer_opnieuw.text}
        </button>
      </Content>
    </Layout>
  );
};

export default ErrorPage;
