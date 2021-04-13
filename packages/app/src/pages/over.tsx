import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Heading } from '~/components-styled/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { RichContentBlock } from '~/types/cms';
interface OverData {
  title: string | null;
  description: RichContentBlock[] | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>((_context) => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;
    return `
    *[_type == 'overDitDashboard']{
      ...,
      "description": {
        "_type": description._type,
        "${locale}": [
          ...description.${locale}[]
          {
            ...,
            "asset": asset->
           },
        ]
      }
    }[0]
    `;
  })
);

const Over = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { content, lastGenerated } = props;

  return (
    <Layout {...siteText.over_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <Box bg="white">
        <Box
          pb={5}
          pt={6}
          px={{ _: 3, sm: 0 }}
          maxWidth="contentWidth"
          mx="auto"
        >
          {content.title && <Heading level={2}>{content.title}</Heading>}
          {content.description && <RichContent blocks={content.description} />}
        </Box>
      </Box>
    </Layout>
  );
};

export default Over;
