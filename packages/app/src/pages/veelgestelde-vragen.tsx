import Head from 'next/head';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Collapsible } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import siteText, { targetLanguage } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Box } from '~/components-styled/base';
interface VeelgesteldeVragenData {
  title: string | null;
  description: RichContentBlock[] | null;
  questions: CollapsibleList[];
}

const query = `*[_type == 'veelgesteldeVragen']{
  ...,
  "description": {
    "_type": description._type,
    "${targetLanguage}": [
      ...description.${targetLanguage}[]
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
        "${targetLanguage}": [...content.${targetLanguage}[]
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

const Verantwoording: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <>
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
                    <Collapsible key={id} id={id} summary={item.title}>
                      {item.content && (
                        <Box mt={3}>
                          <RichContent blocks={item.content} />
                        </Box>
                      )}
                    </Collapsible>
                  );
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.veelgestelde_vragen_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
