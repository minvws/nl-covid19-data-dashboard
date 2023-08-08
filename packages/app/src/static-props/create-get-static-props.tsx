import { GetStaticPropsContext } from 'next';

/**
 * This file looks unnecessarily complex, but it's a way to tell the TS compiler
 * this createGetStaticProps can receive an X amount of getters. It will merge
 * all results into a single object, all properly typed.
 */

export function createGetStaticProps<R0>(fn: () => Promise<R0> | R0): () => Promise<{ props: R0 }>;

export function createGetStaticProps<ARG, R0>(fn: (arg: ARG) => Promise<R0> | R0): (arg: ARG) => Promise<{ props: R0 }>;

export function createGetStaticProps<R0, R1>(fn0: () => Promise<R0> | R0, fn1: () => Promise<R1> | R1): () => Promise<{ props: R0 & R1 }>;

export function createGetStaticProps<ARG, R0, R1>(fn0: (arg: ARG) => Promise<R0> | R0, fn1: (arg: ARG) => Promise<R1> | R1): (arg: ARG) => Promise<{ props: R0 & R1 }>;

export function createGetStaticProps<R0, R1, R2>(fn0: () => Promise<R0> | R0, fn1: () => Promise<R1> | R1, fn2: () => Promise<R2> | R2): () => Promise<{ props: R0 & R1 & R2 }>;

export function createGetStaticProps<ARG, R0, R1, R2>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 }>;

export function createGetStaticProps<R0, R1, R2, R3>(
  fn0: () => Promise<R0> | R0,
  fn1: () => Promise<R1> | R1,
  fn2: () => Promise<R2> | R2,
  fn3: () => Promise<R3> | R3
): () => Promise<{ props: R0 & R1 & R2 & R3 }>;

export function createGetStaticProps<ARG, R0, R1, R2, R3>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2,
  fn3: (arg: ARG) => Promise<R3> | R3
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 & R3 }>;

export function createGetStaticProps<R0, R1, R2, R3, R4>(
  fn0: () => Promise<R0> | R0,
  fn1: () => Promise<R1> | R1,
  fn2: () => Promise<R2> | R2,
  fn3: () => Promise<R3> | R3,
  fn4: () => Promise<R4> | R4
): () => Promise<{ props: R0 & R1 & R2 & R3 & R4 }>;

export function createGetStaticProps<ARG, R0, R1, R2, R3, R4>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2,
  fn3: (arg: ARG) => Promise<R3> | R3,
  fn4: (arg: ARG) => Promise<R4> | R4
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 & R3 & R4 }>;

export function createGetStaticProps<R0, R1, R2, R3, R4, R5>(
  fn0: () => Promise<R0> | R0,
  fn1: () => Promise<R1> | R1,
  fn2: () => Promise<R2> | R2,
  fn3: () => Promise<R3> | R3,
  fn4: () => Promise<R4> | R4,
  fn5: () => Promise<R5> | R5
): () => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 }>;

export function createGetStaticProps<ARG, R0, R1, R2, R3, R4, R5>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2,
  fn3: (arg: ARG) => Promise<R3> | R3,
  fn4: (arg: ARG) => Promise<R4> | R4,
  fn5: (arg: ARG) => Promise<R5> | R5
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 }>;

export function createGetStaticProps<R0, R1, R2, R3, R4, R5, R6>(
  fn0: () => Promise<R0> | R0,
  fn1: () => Promise<R1> | R1,
  fn2: () => Promise<R2> | R2,
  fn3: () => Promise<R3> | R3,
  fn4: () => Promise<R4> | R4,
  fn5: () => Promise<R5> | R5,
  fn6: () => Promise<R6> | R6
): () => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 & R6 }>;

export function createGetStaticProps<ARG, R0, R1, R2, R3, R4, R5, R6>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2,
  fn3: (arg: ARG) => Promise<R3> | R3,
  fn4: (arg: ARG) => Promise<R4> | R4,
  fn5: (arg: ARG) => Promise<R5> | R5,
  fn6: (arg: ARG) => Promise<R6> | R6
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 & R6 }>;

export function createGetStaticProps<R0, R1, R2, R3, R4, R5, R6, R7>(
  fn0: () => Promise<R0> | R0,
  fn1: () => Promise<R1> | R1,
  fn2: () => Promise<R2> | R2,
  fn3: () => Promise<R3> | R3,
  fn4: () => Promise<R4> | R4,
  fn5: () => Promise<R5> | R5,
  fn6: () => Promise<R6> | R6,
  fn7: () => Promise<R7> | R7
): () => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 & R6 & R7 }>;

export function createGetStaticProps<ARG, R0, R1, R2, R3, R4, R5, R6, R7>(
  fn0: (arg: ARG) => Promise<R0> | R0,
  fn1: (arg: ARG) => Promise<R1> | R1,
  fn2: (arg: ARG) => Promise<R2> | R2,
  fn3: (arg: ARG) => Promise<R3> | R3,
  fn4: (arg: ARG) => Promise<R4> | R4,
  fn5: (arg: ARG) => Promise<R5> | R5,
  fn6: (arg: ARG) => Promise<R6> | R6,
  fn7: (arg: ARG) => Promise<R7> | R7
): (arg: ARG) => Promise<{ props: R0 & R1 & R2 & R3 & R4 & R5 & R6 & R7 }>;

export function createGetStaticProps(): () => Promise<Record<string, unknown>>;

export function createGetStaticProps(...fns: ((...args: unknown[]) => Record<string, unknown>)[]): unknown {
  return async (context: GetStaticPropsContext) => {
    try {
      const promisedProps = await Promise.all(fns.length > 0 ? fns.map((fn) => Promise.resolve(fn(context))) : []);

      const props = promisedProps.reduce((res, val) => ({ ...res, ...val }), {});

      return {
        props,
        /**
         * @TODO revalidation should be disabled for now.
         * revalidate: 1,
         */
      };
    } catch (e) {
      // There's no accessible SystemError class so we cannot do `instanceof
      // SystemError`, so this is a way to keep TS happy
      if (e instanceof Error) {
        const systemError = e as SystemError;
        if (systemError.code && systemError.code === 'ENOENT') {
          return {
            notFound: true,
          };
        }
      }

      throw e;
    }
  };
}

export interface SystemError extends Error {
  code: string;
}

// Type the results of createGetStaticProps
export type StaticProps<T extends (arg: any) => Promise<{ props: Record<string, unknown> }>> = Await<ReturnType<T>>['props'];
