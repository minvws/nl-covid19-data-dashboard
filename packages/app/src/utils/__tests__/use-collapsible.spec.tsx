import { cleanup, fireEvent, render } from '@testing-library/react';
import injectJsDom from 'jsdom-global';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useCollapsible } from '../use-collapsible';

const UseCollapsible = suite('useCollapsible');

UseCollapsible.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseCollapsible.after((context) => {
  context.cleanupJsDom();
});

UseCollapsible.after.each(() => {
  cleanup();
});

UseCollapsible(
  'should toggle the isOpen state after the button is clicked',
  (context) => {
    function TestCase() {
      const { button, isOpen } = useCollapsible();
      context.isOpen = isOpen;
      return <>{button()}</>;
    }

    const result = render(<TestCase />);

    assert.is(context.isOpen, false);

    fireEvent.click(result.getByTitle('toggle content'));

    assert.is(context.isOpen, true);
  }
);

UseCollapsible('should not show the content when is initially closed', () => {
  function TestCase() {
    const { content } = useCollapsible({ isOpen: false });
    return <>{content(<p>Content</p>)}</>;
  }

  const result = render(<TestCase />);

  const content = result.getByText('Content');
  const parent = content.parentElement as HTMLElement;
  const ariaHidden = parent.getAttribute('aria-hidden');

  assert.is(ariaHidden, 'true');
});

UseCollapsible('should not show the content when is initially open', () => {
  function TestCase() {
    const { content } = useCollapsible({ isOpen: true });
    return <>{content(<p>Content</p>)}</>;
  }

  const result = render(<TestCase />);

  const content = result.getByText('Content');
  const parent = content.parentElement as HTMLElement;
  const ariaHidden = parent.getAttribute('aria-hidden');

  assert.is(ariaHidden, 'false');
});

UseCollapsible.run();
