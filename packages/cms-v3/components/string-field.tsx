import { Card, Text } from '@sanity/ui';
import { StringFieldProps } from 'sanity';

// TODO: Figure out if we want to use this

export const StringField = (props: StringFieldProps) => {
  const { children, title, description, value = '' } = props;
  // console.log('String Field', props);
  return (
    <Card padding={2}>
      <Card paddingY={2}>
        <Text size={1} weight="semibold">
          {title}
        </Text>
      </Card>
      <Card paddingTop={1} paddingBottom={2}>
        <Text size={1} muted>
          {description}
        </Text>
      </Card>
      <Card>{children}</Card>
    </Card>
  );
};
