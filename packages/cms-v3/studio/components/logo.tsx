import {Box, Flex, Text} from '@sanity/ui'
import {LogoProps, useDataset} from 'sanity'
import logo from '../../assets/logo.svg'

export const Logo = ({title}: LogoProps) => {
  const dataset = useDataset()

  return (
    <Flex align="center" justify="space-between">
      <img src={logo} alt={title} />
      <Box padding={4}>
        <Text>
          {title} | {dataset === 'development' ? 'Development' : ''}
        </Text>
      </Box>
    </Flex>
  )
}
