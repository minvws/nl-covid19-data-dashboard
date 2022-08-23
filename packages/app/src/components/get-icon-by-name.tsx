import * as allIcons from '@corona-dashboard/icons';
import { iconName2filename, IconProps } from '@corona-dashboard/icons';
import React from 'react';
import { isDefined } from 'ts-is-present';
import { assert } from '~/utils/assert';

type IconName = keyof typeof iconName2filename;
type IconCollection = Record<IconName, React.ComponentType>;

interface DynamicIconProps extends IconProps {
  name: IconName;
}

/**
 * Returns an icon component by the name of the icon
 * Throws when requested component was not found
 */
function getIconByName(name: IconName) {
  const icons: IconCollection = allIcons;
  const DynamicIcon = icons[name];

  assert(
    isDefined(DynamicIcon),
    `[${getIconByName.name}] Icon with name "${name}" does not exist`
  );

  return DynamicIcon;
}

/**
 * Renders an icon component by the name of the icon
 */
function DynamicIcon({ name, ...otherProps }: DynamicIconProps) {
  const Icon = getIconByName(name);
  return <Icon {...otherProps} />;
}

export default DynamicIcon;
