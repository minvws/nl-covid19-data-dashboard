import { replaceVariablesInText } from '../replaceVariablesInText';

describe('Util: replaceVariablesInText', () => {
  it('Should return the translation string if no variables are present', () => {
    expect(
      replaceVariablesInText('Example translation string')
    ).toMatchInlineSnapshot(`"Example translation string"`);
  });

  it('Should remove any curly bracket variables if no variables (or no variable with that key) is supplied and replace them with an empty string.', () => {
    expect(
      replaceVariablesInText('Example translation {{variableName}} string')
    ).toMatchInlineSnapshot(`"Example translation  string"`);

    expect(
      replaceVariablesInText(
        'Example translation with {{firstKey}} and {{secondKey}}',
        { firstKey: 'one' }
      )
    ).toMatchInlineSnapshot(`"Example translation with one and "`);
  });

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
      replaceVariablesInText('Example translation {{')
    ).toMatchInlineSnapshot(`"Example translation {{"`);
  });

  it('Should return an empty string if no translation string is supplied', () => {
    expect(replaceVariablesInText()).toMatchInlineSnapshot(`""`);
  });
});
