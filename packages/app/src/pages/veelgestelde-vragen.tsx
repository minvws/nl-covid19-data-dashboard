import Head from 'next/head';
import { RichContent } from '~/components-styled/cms/rich-content';
import { CollapsibleSection } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Box } from '~/components-styled/base';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';

interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: CollapsibleList[];
}

//@TODO THIS NEEDS TO COME FROM CONTEXT
const locale = 'nl';
const query = `*[_type == 'veelgesteldeVragen']{
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
  },
  "questions": [
    ...questions[]
    {
      ...,
                
      "content": {
        ...content,
        "${locale}": [...content.${locale}[]
          {
            ...,
            "asset": asset->
           },
        ]
      }
  }]
  
}[0]
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<VeelgesteldeVragenData>(query)
);

const Verantwoording = (
  props: Await<ReturnType<typeof getStaticProps>>['props']
) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout
      {...siteText.veelgestelde_vragen_metadata}
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

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            {content.title && <h2>{content.title}</h2>}
            {content.description && (
              <RichContent blocks={content.description} />
            )}
            {content.questions && (
              <article>
                {content.questions.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return (
                    <CollapsibleSection key={id} id={id} summary={item.title}>
                      {item.content && (
                        <Box mt={3}>
                          <RichContent blocks={item.content} />
                        </Box>
                      )}
                    </CollapsibleSection>
                  );
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </Layout>
  );
};

export default Verantwoording;
