import * as allIcons from '@corona-dashboard/icons';

interface DynamicIconProps {
    iconName: string
}

/**
 * Returns a icon component by the name of the icon
 */

export default function ({iconName}: DynamicIconProps
) {
  const DynamicIcon = allIcons[iconName]
  return <DynamicIcon />
}