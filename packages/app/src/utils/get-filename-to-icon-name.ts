import { iconName2filename } from '@corona-dashboard/icons';
import { IconName } from '@corona-dashboard/icons/src/icon-name2filename';

/**
 * Return the iconName by passing in the name of the file name.
 * For example pass in: 'afstand_sporten.svg' and outputs: afstandSporten
 */

export const getFilenameToIconName = (filename: string) =>
  Object.keys(iconName2filename).find((iconName) => {
    const typedIconName = iconName as IconName;
    return iconName2filename[typedIconName] === filename;
  });
