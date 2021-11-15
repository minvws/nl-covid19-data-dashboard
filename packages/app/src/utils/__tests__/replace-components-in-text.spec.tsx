import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { replaceComponentsInText } from '../replace-components-in-text';
import * as M from '../replace-components-in-text';
import injectJsDom from 'jsdom-global';
import { cleanup, render } from '@testing-library/react';
import * as sinon from 'sinon';

const ReplaceComponentsInText = suite('replaceComponentsInText');

ReplaceComponentsInText.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

ReplaceComponentsInText.after((context) => {
  context.cleanupJsDom();
});

ReplaceComponentsInText.after.each(() => {
  cleanup();
  sinon.restore();
});

ReplaceComponentsInText(
  'should replace variables in double curly braces with passed components',
  () => {
    const { queryByTestId } = render(
      <>
        {replaceComponentsInText('{{greeting}}, {{name}}!', {
          greeting: <span data-testid="greeting">Hello</span>,
          name: <span data-testid="name">world</span>,
        })}
      </>
    );

    assert.ok(queryByTestId('greeting'));
    assert.ok(queryByTestId('name'));
    assert.equal(queryByTestId('greeting')?.textContent, 'Hello');
    assert.equal(queryByTestId('name')?.textContent, 'world');
  }
);

ReplaceComponentsInText(
  'should throw when undefined variables are passed and validation is enabled',
  () => {
    assert.throws(() =>
      render(<>{replaceComponentsInText('Hello, {{name}}!', {})}</>)
    );
  }
);

ReplaceComponentsInText(
  'should replace variables with an error string when undefined and validation is disabled',
  () => {
    sinon.replace(M, 'shouldValidate', false);

    const { container } = render(
      <>{replaceComponentsInText('Hello, {{name}}!', {})}</>
    );

    assert.ok(container.textContent?.includes('[#ERROR {{name}}]'));
  }
);

ReplaceComponentsInText.run();
