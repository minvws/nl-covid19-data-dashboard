import traverse from 'traverse';

const isText = (value: string) => typeof value === 'string';

export const visit = (obj: any, visitor: (para: string) => string) => {
  return traverse(obj).forEach(function (x) {
    if (isText(x)) this.update(visitor(x));
  });
};
