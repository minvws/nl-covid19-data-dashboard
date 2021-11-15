import { cleanup, fireEvent, render } from '@testing-library/react';
import injectJsDom from 'jsdom-global';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useTabInteractiveButton } from '../use-tab-interactive-button';

const UseTabInteractiveButton = suite('useTabInteractiveButton');

UseTabInteractiveButton.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseTabInteractiveButton.after((context) => {
  context.cleanupJsDom();
});

UseTabInteractiveButton.after.each(() => {
  cleanup();
});

UseTabInteractiveButton(
  'should render the button and set isTabInteractive after click',
  (context) => {
    function TestCase() {
      const { tabInteractiveButton, isTabInteractive } =
        useTabInteractiveButton('test');
      context.isTabInteractive = isTabInteractive;
      return <>{tabInteractiveButton}</>;
    }

    const result = render(<TestCase />);

    assert.equal(context.isTabInteractive, false);

    fireEvent.click(result.getByText('test'));

    assert.equal(context.isTabInteractive, true);
  }
);

UseTabInteractiveButton(
  'should set isTabInteractive to false after blur',
  async (context) => {
    function TestCase() {
      const { tabInteractiveButton, isTabInteractive } =
        useTabInteractiveButton('test');
      context.isTabInteractive = isTabInteractive;
      return <>{tabInteractiveButton}</>;
    }

    const result = render(<TestCase />);

    fireEvent.click(result.getByText('test'));

    assert.equal(context.isTabInteractive, true);

    fireEvent.blur(result.getByText('test'));

    await new Promise((resolve) => setTimeout(resolve, 10));

    assert.equal(context.isTabInteractive, false);
  }
);

UseTabInteractiveButton.run();
