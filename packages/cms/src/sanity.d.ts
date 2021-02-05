declare module 'part:@sanity/form-builder/patch-event' {
  export * from '@sanity/form-builder/lib/PatchEvent';
}

declare module 'all:part:@sanity/base/schema-type' {
  let types: any[];
  export default types;
}

declare module 'part:@sanity/base/schema-creator' {
  export default function createSchema(schema: any): any;
}

// /* eslint-disable react/no-multi-comp, @typescript-eslint/no-empty-function*/
// declare module 'part:@sanity/components/*' {
//   class SanityInputComponent extends React.Component<any> {
//     focus() {}
//   }
//   export default SanityInputComponent;
// }
// declare module 'part:@sanity/components/selects/*' {
//   class SanitySelectComponent extends React.Component<any> {
//     focus() {}
//   }
//   export default SanitySelectComponent;
// }

// declare module 'part:@sanity/components/toggles/*' {
//   class SanityToggleComponent extends React.Component<any> {
//     focus() {}
//   }
//   export default SanityToggleComponent;
// }

// declare module 'part:@sanity/components/tags/*' {
//   class SanityTagsComponent extends React.Component<any> {
//     focus() {}
//   }
//   export default SanityTagsComponent;
// }

// declare module 'part:@sanity/components/textareas/*' {
//   class SanityTextareaComponent extends React.Component<any> {
//     focus() {}
//   }
//   export default SanityTextareaComponent;
// }

// declare module 'part:@sanity/components/utilities/portal';
// declare module 'part:@sanity/components/lists/*';
// declare module 'part:@sanity/*';

// declare module '*.css' {
//   const shim: any;
//   export default shim;
// }

declare module '*.svg' {
  import React = require('react');
  const src: string;
  export default src;
}
