const camelCase = require('camelcase');
const fs = require('fs');
const lodash = require('lodash');
const pascalcase = require('pascalcase');
const path = require('path');
const format = require('prettier-eslint');
const { parseSync, stringify } = require('svgson');
const eslintConfig = require('../.eslintrc');
const prettierOptions = require('../.prettierrc');

const rootDir = path.join(__dirname, '..');

const svgDir = path.join(rootDir, 'src/svg');

const svgIcons = {};

fs.readdirSync(svgDir).forEach((file) => {
  const extension = path.extname(file);
  if (extension === '.svg') {
    const key = file.slice(0, -4);
    const data = fs.readFileSync(
      path.resolve(rootDir, `src/svg/${file}`),
      'utf8'
    );
    svgIcons[key] = data;
  }
});

const icons = Object.keys(svgIcons);

const dir = path.join(rootDir, 'src/icons');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const initialTypeDefinitions = `/// <reference types="react" />
import { FC, SVGAttributes } from 'react';

export interface IconProps extends SVGAttributes<SVGElement> {}

export type Icon = FC<IconProps>;
`;

fs.writeFileSync(
  path.join(rootDir, 'src', 'index.ts'),
  `${initialTypeDefinitions}\nexport { iconName2filename } from './icon-name2filename';\n`,
  'utf-8'
);

// We want our icons to predictable in usage. That means we filter out properties that we think
// should be applied at an instance level instead of at a source level. E.g. we don't want to set
// focusable=false or aria-hidden=true in the source SVG files
const allowedAttributes = [
  'width',
  'height',
  'fill',
  'stroke',
  'viewbox',
  'role',
  'focusable',
  'rest',
];

const allowedAttributesForChildren = [
  'width',
  'height',
  'transform',
  'fill',
  'fill-rule',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'points',
  'd',
  'r',
  'x',
  'cx',
  'rx',
  'y',
  'cy',
  'ry',
]

const attrsToString = (attrs, isSvgRoot = false) => {
  return Object.keys(attrs)
    // Remove all excluded keys because we want clean, predictable components
    .filter((key) => {
      return allowedAttributes.includes(key);
    })
    .map((key) => {
      if (key === 'rest') {
        return '{...rest}';
      }
      if (key === 'fill' || key === 'stroke') {
        switch (attrs[key]) {
          case 'currentColor':
            return key + '="currentColor"';
          case '#fff':
          case '#ffffff':
          case 'white':
          case '#FFF':
          case '#FFFFFFF':
          case 'WHITE':
            return key + '="fff"'; // ToDo: remove when design-team adjuste all current layered SVG's
          default:
            return key + '="currentColor"';
        }
      }
      if (key === 'width' && isSvgRoot) {
        // Convert any width and height to viewbox dimensions.
        return attrs['height'] && !attrs['viewbox'] ? `viewbox="0 0 ${attrs['width']} ${attrs['height']}"`: ``;
      }
      if (key === 'height' && isSvgRoot) {
        return
      }
      return key + '="' + attrs[key] + '"';
    })
    .join(' ')
};

const validateAttrs = (key, attribute, i) => {
  if (key === 'fill' || key === 'stroke') {
    switch (attribute) {
      case 'currentColor':
        break
      case '#fff':
      case '#ffffff':
      case 'white':
      case '#FFF':
      case '#FFFFFFF':
      case 'WHITE':
        return `${key}="${attribute}" has a white ${key}; Which is not allowed.`;
      case 'none':
        return `${key}="${attribute}" has a ${key} of none; Which is not allowed.`;
      default:
        return `${key}="${attribute}" has a hardcoded colored ${key}; Which is not allowed.` ;
    }
  }
  if (key === 'width' || key === 'height') {
    return `Element contains ${key} which is not allowed"`;
  }
  if (key === 'viewbox') {
    if (attribute !== '0 0 56 56') {
      console.log(`WARNING: File: 'src/svg/${i}.svg' contains: ${key}="${attribute}" which does not comply with viewbox="0 0 56 56"`);
    }
  }
  return false;
}

const lookup = icons.sort().map((x) => `${pascalcase(x)}: '${x}.svg'`);

const iconName2filename = [
  'export const iconName2filename: Record<string, string> = {',
]
  .concat(lookup.join(','))
  .concat(['}', '']);

fs.writeFileSync(
  path.join(rootDir, 'src', 'icon-name2filename.ts'),
  format({
    text: iconName2filename.join('\n'),
    eslintConfig,
    prettierOptions,
  }),
  { encoding: 'utf-8' }
);

let newSvgsExported = false;

icons.forEach((i) => {
  const location = path.join(rootDir, 'src/icons', `${i}.tsx`);
  const svgLocation = path.join(rootDir, 'src/svg', `${i}.svg`);
  const ComponentName = pascalcase(i);

  const parsedSvg = parseSync(svgIcons[i]);
  const { attributes } = parsedSvg;

  /**
   * All keys in React need to be camelCased in order to work
   * We loop over the attributes and rename them automatically with the camelcase package
   */
  const parsedChildrenForSvgExport = parsedSvg.children.map((child) => {
    for (const [key] of Object.entries(child.attributes)) {
      if (!allowedAttributesForChildren.includes(key)) {
        delete child.attributes[key]
      }
    }
    return child;
  });

  // Stringify the children so we can wrap it in a SVG container later
  const svgExportChildrenInString = stringify(parsedSvg.children);

  /**
   * All keys in React need to be camelCased in order to work
   * We loop over the attributes and rename them automatically with the camelcase package
   */
  parsedSvg.children = parsedSvg.children.map((child) => {
    const copy = child;
    copy.attributes = lodash.mapKeys(copy.attributes, (_value, key) => {
      return camelCase(key);
    });

    return copy;
  });

  // Stringify the children so we can wrap it in a SVG container later
  const iconWithoutWrapper = stringify(parsedSvg.children);

  // There's almost no benefit to the manual SVG containing element so far.
  // The problem is we didn't output all SVG's as paths. Some use strokes and some use fills.
  // If we make sure we outline all components, we can use fill and stroke in a predictable manner.
  // Now... not so much.
  const defaultAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    ...attributes,
    rest: '...rest',
  };

  const childAttrs = parsedChildrenForSvgExport.map((child) => child.attributes);
  
  const attributesWithErrors = {
    svgElement: Object.keys(attributes).map((key) => validateAttrs(key, attributes[key], i)).filter(Boolean),
    children: Object.keys(childAttrs).map((key) => validateAttrs(key, childAttrs[key], i)).filter(Boolean)
  }

  const element = `
    import React, {forwardRef} from 'react';

    const ${ComponentName} = forwardRef<SVGElement, any>(({ ...rest }, ref) => {
      return (
        <svg ref={ref} ${attrsToString(defaultAttrs, true)} >
          ${iconWithoutWrapper}
        </svg>
      )
    });

    ${ComponentName}.displayName = '${ComponentName}'

    export default ${ComponentName}
  `;

  const svgElement = () => {
    if (attributesWithErrors.svgElement.length > 0 || attributesWithErrors.children.length > 0) {
      console.log(`File: 'src/svg/${i}.svg'
React component result: 'src/icons/${i}.tsx' Please check.
  ${attributesWithErrors.svgElement.length > 0 ? `Inside <svg>:\n    -${attributesWithErrors.svgElement.join('\n    -')}` : ''}
  ${attributesWithErrors.children.length > 0 ? `Inside a child:\n    -${attributesWithErrors.children.join('\n    -')}` : ''}
`);

      const svgAttributes = {
        xmlns: 'http://www.w3.org/2000/svg',
        ...attributes,
      };

      return `<svg ${attrsToString(svgAttributes, true)}>
        ${svgExportChildrenInString}
      </svg>`;
    }
    return false;
  }
  
  const changedSvg = svgElement();
  if (changedSvg) {
    fs.writeFileSync(svgLocation, changedSvg, 'utf-8');
  
    newSvgsExported = true;
  }

  const component = format({
    text: element,
    eslintConfig,
    prettierOptions,
  });

  fs.writeFileSync(location, component, 'utf-8');

  const exportString = `export { default as ${ComponentName} } from './icons/${i}';\r\n`;
  fs.appendFileSync(
    path.join(rootDir, 'src', 'index.ts'),
    exportString,
    'utf-8'
  );

  const exportTypeString = `export const ${ComponentName}: Icon;\n`;
  fs.appendFileSync(
    path.join(rootDir, 'src', 'index.d.ts'),
    exportTypeString,
    'utf-8'
  );
});

const destSvgDir = path.join(__dirname, '../../app/public/icons/app');
if (!fs.existsSync(destSvgDir)) {
  fs.mkdirSync(destSvgDir);
}
icons
  .map((x) => `${x}.svg`)
  .forEach((x) => {
    fs.copyFileSync(path.join(svgDir, x), path.join(destSvgDir, x));
  });
  
if (newSvgsExported) {
  console.log(`New SVG export(s) made`);
} else {
  console.log(`No SVG changes made`);
}

console.log('Done writing Icons');
