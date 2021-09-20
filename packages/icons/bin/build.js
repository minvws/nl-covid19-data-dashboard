const path = require('path');
const fs = require('fs');
const format = require('prettier-eslint');
const upperCamelCase = require('uppercamelcase');
const camelCase = require('camelcase');
const lodash = require('lodash');
const prettierOptions = require('../.prettierrc');
const eslintConfig = require('../.eslintrc');

const { parseSync, stringify } = require('svgson');

const rootDir = path.join(__dirname, '..');

const svgDir = path.join(rootDir, 'src/svg');

const svgIcons = {};

fs.readdirSync(svgDir).forEach((file) => {
  const extension = path.extname(file);
  if (extension === '.svg') {
    const key = file.slice(0, -4);
    const data = fs.readFileSync(
      path.resolve(__dirname, '..', `src/svg/${file}`),
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

fs.writeFileSync(path.join(rootDir, 'src', 'index.js'), '', 'utf-8');
fs.writeFileSync(
  path.join(rootDir, 'src', 'index.d.ts'),
  initialTypeDefinitions,
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
  'viewBox',
  'role',
  'focusable',
  'rest',
];

const attrsToString = (attrs) => {
  return (
    Object.keys(attrs)
      // Remove all excluded keys because we want clean, predictable components
      .filter((key) => {
        return allowedAttributes.includes(key);
      })
      .map((key) => {
        if (key === 'width' || key === 'height') {
          return key + '={' + attrs[key] + '}';
        }
        if (key === 'rest') {
          return '{...rest}';
        }
        return key + '="' + attrs[key] + '"';
      })
      .join(' ')
  );
};

icons.forEach((i) => {
  const location = path.join(rootDir, 'src/icons', `${i}.js`);
  const ComponentName = upperCamelCase(i);

  const parsedSvg = parseSync(svgIcons[i]);
  const { attributes } = parsedSvg;

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

  const element = `
    import React, {forwardRef} from 'react';

    const ${ComponentName} = forwardRef(({ ...rest }, ref) => {
      return (
        <svg ref={ref} ${attrsToString(defaultAttrs)} >
          ${iconWithoutWrapper}
        </svg>
      )
    });

    ${ComponentName}.displayName = '${ComponentName}'

    export default ${ComponentName}
  `;

  const component = format({
    text: element,
    eslintConfig,
    prettierOptions,
  });

  fs.writeFileSync(location, component, 'utf-8');

  // eslint-disable-next-line no-console
  // console.log('Successfully built', ComponentName);

  const exportString = `export { default as ${ComponentName} } from './icons/${i}';\r\n`;
  fs.appendFileSync(
    path.join(rootDir, 'src', 'index.js'),
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

console.log('Done writing Icons');
