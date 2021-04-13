import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
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
      <Box bg="white">
        <Box
          pb={5}
          pt={6}
          px={{ _: 3, sm: 0 }}
          maxWidth="contentWidth"
          mx="auto"
        >
          <Heading level={1}>{siteText.error_titel.text}</Heading>
          <Text>{siteText.error_beschrijving.text}</Text>

          <button
            onClick={() => {
              location.reload();
            }}
          >
            {siteText.error_probeer_opnieuw.text}
          </button>
        </Box>
      </Box>
    </Layout>
  );
};

export default ErrorPage;
