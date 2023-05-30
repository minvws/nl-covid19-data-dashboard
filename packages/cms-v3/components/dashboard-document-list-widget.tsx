import { DashboardWidgetContainer } from '@sanity/dashboard';
import { Button, Flex } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { IntentButton, Preview, SanityDocument, getPublishedId, useClient, useSchema } from 'sanity';
import styled from 'styled-components';

interface DashboardDocumentListWidgetProps {
  title: string | undefined;
  query: string | undefined;
  createButtonText: string | null;
  types: string[] | null;
}

// TODO: Add fetch more button. Set state for the limit.
export const DashboardDocumentListWidget = ({ title, query, createButtonText, types }: DashboardDocumentListWidgetProps) => {
  const [documents, setDocuments] = useState<SanityDocument[] | undefined>(undefined);
  const [limit, setLimit] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const client = useClient({ apiVersion: '2021-10-21' });

  const fetchDocuments = async () => {
    if (documents && !(documents?.length >= limit)) setLimit((previousLimit) => previousLimit + 25);

    setIsLoading(true);

    const response = query ? await client.fetch(`${query}[0...${limit}]`) : undefined;
    setDocuments(response);
    setLimit((previousLimit) => previousLimit + 25);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!documents) fetchDocuments();
  }, []);

  useEffect(() => {
    console.log(documents);
  }, [documents]);

  return (
    <DashboardWidgetContainer
      header={title}
      // TODO: Implement fetch more button, only if there is more to fetch
      footer={
        <Flex direction="row" align="center" justify="space-between">
          <Button onClick={fetchDocuments} mode="bleed" padding={[2, 4]} tone="primary" text={isLoading ? 'Laden...' : 'Toon meer'} style={{ cursor: 'pointer' }} />

          {createButtonText && types && (
            <IntentButton
              mode="bleed"
              style={{ width: '100%' }}
              paddingX={2}
              paddingY={4}
              tone="primary"
              type="button"
              intent="create"
              params={{ type: types[0] }}
              text={createButtonText}
              icon={BsPlus}
            />
          )}
        </Flex>
      }
    >
      <DashboardDocumentWidgetContainer>
        {documents?.map((document) => (
          <DashboardDocumentWidgetEntry key={document._id} document={document} />
        ))}
      </DashboardDocumentWidgetContainer>
    </DashboardWidgetContainer>
  );
};

const DashboardDocumentWidgetEntry = ({ document }: { document: SanityDocument }) => {
  const schema = useSchema();
  const type = schema.get(document._type);

  if (!type) return null;

  return (
    <IntentButton
      style={{ width: '100%' }}
      intent="edit"
      mode="bleed"
      params={{
        type: document._type,
        id: getPublishedId(document._id),
      }}
    >
      <Preview schemaType={type} value={document} />
    </IntentButton>
  );
};

const DashboardDocumentWidgetContainer = styled.div`
  height: 500px;
  overflow-y: scroll;
`;
