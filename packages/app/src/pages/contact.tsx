import Head from 'next/head';
import styled from 'styled-components';
import { VisuallyHidden } from '~/components';
import { ContactPageGroup } from '~/components/contact/contact-page-group';
import { ContactPage } from '~/components/contact/types';
import { Heading } from '~/components/typography';
import { ContentLayout } from '~/domain/layout/content-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { mediaQueries, space } from '~/style/theme';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ContactPage>((context) => {
    const { locale } = context;

    return `// groq
    *[_type == 'contact'] {
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
    content: { groups },
    lastGenerated,
  } = props;

  const middleIndexOfGroups = Math.ceil(groups.length / 2);
  const firstHalf = groups.slice(0, middleIndexOfGroups);
  const secondHalf = groups.slice(middleIndexOfGroups);

  return (
    <Layout {...commonTexts.contact_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>

      <VisuallyHidden>
        <Heading level={1}>Contact</Heading>
      </VisuallyHidden>

      <ContentLayout>
        <ContactLayout>
          <ContactPageGroup groups={firstHalf} />
          <ContactPageGroup groups={secondHalf} />
        </ContactLayout>
      </ContentLayout>
    </Layout>
  );
};

const ContactLayout = styled.div`
  @media ${mediaQueries.sm} {
    display: flex;
    gap: ${space[4]} ${space[5]};
  }
`;

export default Contact;
