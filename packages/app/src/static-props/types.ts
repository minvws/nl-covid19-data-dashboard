export type StaticProps<T extends (...args: any) => any> = Await<
  ReturnType<T>
>['props'];
