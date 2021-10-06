import Head from 'next/head';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Heading } from '~/components/typography';
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

interface OverRisiconiveausData {
  content: RichContentBlock[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>((context) => {
    const { locale } = context;
    return `*[_type == 'overRisicoNiveausNew']
    {
      "content": {
            "_type": content._type,
            "${locale}": [
              ...content.${locale}[]
              {
                (asset == undefined && _type != 'reference') => {
                  ...,
                },
                asset != undefined => {
                  "_type": 'image',
                  "asset": asset->
                },
                _type == 'reference' => {
                  ...*[_id == ^._ref][0]
                }
              },
            ]
          },
    }[0]
    `;
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content } = props;

  console.dir(content);

  return (
    <Layout
      {...siteText.over_risiconiveaus_metadata}
      lastGenerated={lastGenerated}
    >
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
      <Content>
        <Box px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto" spacing={4}>
          <Heading level={1}>Risico</Heading>
          <Box textVariant="body1">
            <RichContent blocks={content.content} />
          </Box>
        </Box>
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  return (
    <Box bg="white">
      <Box
        pt={5}
        pb={5}
        px={{ _: 3, sm: 0 }}
        maxWidth="infoWidth"
        mx="auto"
        spacing={4}
      >
        {children}
      </Box>
    </Box>
  );
}
