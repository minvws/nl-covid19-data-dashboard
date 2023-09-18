import Head from 'next/head';
import { Box } from '~/components/base/box';
import { ContactPageGroupItem } from '~/components/contact/item';
import { ContactPage } from '~/components/contact/types';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { sizes, space } from '~/style/theme';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ContactPage>((context) => {
    const { locale } = context;

    return `// groq
    *[_type == 'contact'] {
      'title': title.${locale},
      'groups': contactPageGroups[]->{
        'id': _id,
        'title': title.${locale},
        'items': contactPageGroupItems[]->{
          'id': _id,
          'title': title.${locale},
          'titleUrl': itemTitleUrl,
          'linkType': linkType.linkType,
          'description': description.${locale},
          'links': contactPageItemLinks[] {
            'id': _id,
            'titleAboveLink': title.${locale},
            'linkType': linkType.linkType,
            'label': link.title.${locale},
            'href': link.href      
          }
        }
      }
    }[0]`;
  })
);

const Contact = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const {
    content: { pageTitle, groups },
    lastGenerated,
  } = props;

  return (
    <Layout {...commonTexts.contact_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>

      {/* The dimensions of this box are duplicated on the FAQ and about page, abstract if possible */}
      <Box margin={`${space[4]} auto`} maxWidth={`${sizes.maxWidth}px`} padding={`0 ${space[3]}`}>
        {pageTitle && (
          <Heading marginBottom={space[4]} level={1}>
            {pageTitle}
          </Heading>
        )}

        {groups.map(({ id, title, items }) => (
          <div key={id}>
            <Heading marginBottom={space[3]} level={2}>
              {title}
            </Heading>

            {items.map((item, index) => (
              <ContactPageGroupItem key={item.id} item={item} index={index} groupItemsLength={items.length} />
            ))}
          </div>
        ))}
      </Box>
    </Layout>
  );
};

export default Contact;
