import { DashboardWidgetContainer } from '@sanity/dashboard';
import { Button, Flex } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { IntentButton, Preview, SanityDocument, getPublishedId, useClient, useSchema } from 'sanity';
import styled from 'styled-components';

interface DashboardDocumentListWidgetProps {
  title: string | undefined;
  query: string | undefined;
  countQuery: string;
  createButtonText: string | null;
  types: string[] | null;
}

export const DashboardDocumentListWidget = ({ title, query, countQuery, createButtonText, types }: DashboardDocumentListWidgetProps) => {
  const [documents, setDocuments] = useState<SanityDocument[]>([]);
  const [limit, setLimit] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [isFetchMoreDisabled, setIsFetchMoreDisabled] = useState(documents.length === totalDocumentCount);
  const client = useClient({ apiVersion: '2023-05-03' });

  const handleFetchMoreClick = () => setLimit((previousLimit) => previousLimit + 25);

  const fetchDocuments = async () => {
    setIsLoading(true);

    try {
      const startOfQueryLimit = documents && documents.length <= limit ? documents.length : 0;
      const response = await client.fetch(`${query}[${startOfQueryLimit}...${limit}]`);

      setDocuments((previousDocuments) => [...previousDocuments, ...response]);
    } catch (error) {
      console.error(`There was an error while fetching documents: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentCount = async () => {
    try {
      const response = await client.fetch(countQuery);
      setTotalDocumentCount(response);
    } catch (error) {
      console.error(`There was an error fetching the document count: ${error}`);
    }
  };

  /**
   * Resetting styles on the container happens like this because we do not have access to the element within which the dashboard is rendered.
   */
  useEffect(() => {
    const container = document.querySelector('[data-ui="Container"]') as HTMLElement;
    if (container) {
      container.style.maxWidth = 'none';
      container.style.paddingInline = '128px';
    }
  }, []);

  useEffect(() => {
    if (!documents || (documents && documents.length <= limit)) fetchDocuments();
  }, [limit]);

  useEffect(() => {
    fetchDocumentCount();
  }, []);

  useEffect(() => {
    setIsFetchMoreDisabled(documents.length === totalDocumentCount);
  }, [totalDocumentCount]);

  return (
    <DashboardWidgetContainer
      header={`${title} - ${documents.length} van ${totalDocumentCount}`}
      footer={
        <Flex direction="row" align="center" justify="space-between">
          <Button
            onClick={handleFetchMoreClick}
            padding={[2, 4]}
            mode="bleed"
            tone="primary"
            text={isFetchMoreDisabled ? 'Alles geladen' : isLoading ? 'Laden...' : 'Laad meer'}
            style={{ cursor: isFetchMoreDisabled ? 'not-allowed' : 'pointer', width: '100%', borderRadius: 0 }}
            disabled={isFetchMoreDisabled || isLoading}
            title={isFetchMoreDisabled ? 'No more documents to show' : 'Retrieve more documents'}
          />

          {createButtonText && types && (
            <IntentButton
              mode="bleed"
              style={{ width: '100%' }}
              paddingX={2}
              paddingY={4}
              tone="positive"
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
        {documents.map((document) => (
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
