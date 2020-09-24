export function mockMatchMedia(shouldMatchMedia: boolean) {
  global.window.matchMedia = jest.fn().mockReturnValue({
    matches: shouldMatchMedia,
    addListener: () => {},
    removeListener: () => {},
  });
}
