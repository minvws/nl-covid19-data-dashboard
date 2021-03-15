import Head from 'next/head';
import { RichContent } from '~/components-styled/cms/rich-content';
import { CollapsibleSection } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, GetLayoutWithMetadataKey } from '~/domain/layout/layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Box } from '~/components-styled/base';
interface VerantwoordingData {
  title: string | null;
  description: RichContentBlock[] | null;
  collapsibleList: CollapsibleList[];
}

//@TODO THIS NEEDS TO COME FROM CONTEXT
const locale = 'nl';
const query = `
*[_type == 'cijferVerantwoording']{
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
  "collapsibleList": [...collapsibleList[]
    {
      ...,
                
      "content": {
        ...content,
        "${locale}": [
          ...content.${locale}[]
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
  createGetContent<VerantwoordingData>(query)
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
            {content.collapsibleList && (
              <article>
                {content.collapsibleList.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return item.content ? (
                    <CollapsibleSection key={id} id={id} summary={item.title}>
                      {item.content && (
                        <Box mt={3}>
                          <RichContent blocks={item.content} />
                        </Box>
                      )}
                    </CollapsibleSection>
                  ) : null;
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Verantwoording.getLayout = GetLayoutWithMetadataKey('verantwoording_metadata');

export default Verantwoording;
