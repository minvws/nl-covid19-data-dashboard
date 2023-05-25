import { DashboardWidgetContainer } from '@sanity/dashboard';
import { Button, Flex } from '@sanity/ui';

// TODO: Fix.
export const DashboardDocumentListWidget = (props: any) => {
  return (
    <DashboardWidgetContainer
      header="A cat"
      footer={
        <Flex direction="column" align="stretch">
          <Button
            // flex={1}
            paddingX={2}
            paddingY={4}
            mode="bleed"
            tone="primary"
            text="Get new cat"
          />
        </Flex>
      }
    >
      <figure>
        <img src="https://placekitten.com/300/450" />
      </figure>
    </DashboardWidgetContainer>
  );
};
