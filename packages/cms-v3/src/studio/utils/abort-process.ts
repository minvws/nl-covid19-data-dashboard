/**
 * There is currently no native way to exit prompts on ctrl-c. This is a
 * workaround that needs to be added to every prompts instance. For more info
 * see: https://github.com/terkelg/prompts/issues/252#issuecomment-778683666
 */
export const onState = (state: { aborted: boolean }) => {
  if (state.aborted) process.nextTick(() => process.exit(0));
};
