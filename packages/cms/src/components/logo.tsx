import { Card, Flex, Text } from '@sanity/ui';
import { LogoProps, useDataset } from 'sanity';
import logo from '../assets/logo.svg';

export const Logo = ({ title }: LogoProps) => {
  const dataset = useDataset();

  return (
    <Flex align="center" justify="space-between">
      <img src={logo} alt={title} />
      <Card padding={3} radius={2} style={{ backgroundColor: 'transparent' }}>
        <Text>{dataset === 'development' ? `${title} | Development` : title}</Text>
      </Card>
    </Flex>
  );
};
