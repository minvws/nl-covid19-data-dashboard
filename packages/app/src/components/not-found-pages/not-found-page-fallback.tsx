import { Content } from '~/domain/layout/content';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { Heading, Text } from '../typography';

export const NotFoundFallback = ({ lastGenerated }: { lastGenerated: string }) => {
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
