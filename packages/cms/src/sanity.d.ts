type Type = 'Object' | 'String' | 'Number' | 'Boolean' | 'Array' | 'Date';

export class Rule {
  static FIELD_REF: any;
  static array: (def: any) => Rule;
  static object: (def: any) => Rule;
  static string: (def: any) => Rule;
  static number: (def: any) => Rule;
  static boolean: (def: any) => Rule;
  static dateTime: (def: any) => Rule;
  static valueOfField: (path: any) => {
    type: any;
    path: any;
  };
  constructor(typeDef: any);
  FIELD_REF: any;
  _typeDef: any;
  _type: any;
  _rules: any;
  _message: any;
  _required: any;
  _level: string;
  _fieldRules: any;

  valueOfField(...args: any[]): {
    type: any;
    path: any;
  };
  error(message?: string): Rule;
  warning(message?: string): Rule;
  reset(): Rule;
  isRequired(): boolean;
  clone(): Rule;
  cloneWithRules(rules: Rule[]): Rule;
  merge(rule: Rule): Rule;
  validate(value: any, options?: Record<string, any>): any;
  type(targetType: Type): Rule;
  all(children: any): Rule;
  either(children: any): Rule;
  optional(): Rule;
  required(): Rule;
  custom(fn: any): Rule;
  min(len: number): Rule;
  max(len: number): Rule;
  length(len: number): Rule;
  valid(value: any): Rule;
  integer(): Rule;
  precision(limit: number): Rule;
  positive(): Rule;
  negative(): Rule;
  greaterThan(num: any): Rule;
  lessThan(num: any): Rule;
  uppercase(): Rule;
  lowercase(): Rule;
  regex(pattern: any, name: any, opts: any): Rule;
  email(options: any): Rule;
  uri(opts?: { scheme?: (string | RegExp)[]; allowCredentials?: boolean; relativeOnly?: boolean; allowRelative?: boolean }): Rule;
  unique(comparator?: any): Rule;
  reference(): Rule;
  block(fn: any): Rule;
  fields(rules: Record<string, (rule: Rule) => Rule | Rule[]>): Rule;
  assetRequired(): Rule;
}
