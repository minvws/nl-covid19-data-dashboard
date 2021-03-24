declare module 'part:@sanity/form-builder/patch-event' {
  export * from '@sanity/form-builder/lib/PatchEvent';
}

declare module 'part:@sanity/base/client';

declare module 'all:part:@sanity/base/schema-type' {
  let types: any[];
  export default types;
}

declare module 'part:@sanity/base/schema-creator' {
  export default function createSchema(schema: any): any;
}
declare module '*.svg' {
  import React = require('react');
  const src: string;
  export default src;
}
