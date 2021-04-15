import { replaceVariablesInText } from '../replace-variables-in-text';

describe('Util: replaceVariablesInText', () => {
  it('Should replace variables inside curly brackets with the variables supplied', () => {
    expect(
      replaceVariablesInText('Example translation {{keyOne}} {{keyTwo}}.', {
        keyOne: 'with',
        keyTwo: 'variables',
      })
    ).toMatchInlineSnapshot(`"Example translation with variables."`);

    expect(
      replaceVariablesInText(
        'Example translation with a {{ variableName }} with spaces around it.',
        {
          variableName: 'variableKey',
        }
      )
    ).toMatchInlineSnapshot(
      `"Example translation with a variableKey with spaces around it."`
    );
  });

  it('Should leave curly brackets in place if they are not closed.', () => {
    expect(
      replaceVariablesInText('Example translation {{', {})
    ).toMatchInlineSnapshot(`"Example translation {{"`);
  });

  it('Should throw error if no translation string is supplied', () => {
    const testFunc = () => {
      replaceVariablesInText(undefined as any, {});
    };
    expect(testFunc).toThrow(Error);
  });
});
