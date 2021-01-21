const fs = require('fs');
const path = require('path');
const glob = require('glob');
const svgr = require('@svgr/core').default;

const ICONS_SOURCE_DIR = 'assets/';
const COMPONENTS_DIR = 'src/icons';

// Template to generate named exports instaed of default ones
const iconComponentTemplate = (
  { template },
  opts,
  { imports, componentName, jsx }
) =>
  template.smart({ plugins: ['typescript'] }).ast`
        ${imports}
        ${'\n'}
        function ${componentName} (props: React.SVGProps<SVGSVGElement>) {${jsx}};
        export default ${componentName};
    `;

const icons = glob.sync(`${ICONS_SOURCE_DIR}/**/*.svg`);

for (const icon of icons) {
  const svg = fs.readFileSync(icon, 'utf8');
  const componentName = path.parse(icon).name;

  console.log(componentName);

  const componentCode = svgr.sync(
    svg,
    {
      template: iconComponentTemplate,
      // 1. Clean SVG files using SVGO
      // 2. Generate JSX
      // 3. Format the result using Prettier
      plugins: [
        '@svgr/plugin-svgo',
        '@svgr/plugin-jsx',
        '@svgr/plugin-prettier',
      ],
      // Replace hardcoded colors with `currentColor`
      svgoConfig: {
        plugins: [{ convertColors: { currentColor: true } }],
      },
      // Replace dimentions
      svgProps: { height: 32, width: 32, viewBox: '0 0 32 32' },
    },
    { componentName }
  );
  fs.writeFileSync(`${COMPONENTS_DIR}/${componentName}.tsx`, componentCode);
}
