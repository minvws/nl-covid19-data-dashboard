import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { replaceVariablesInText } from '../replace-variables-in-text';

const ReplaceVariablesInText = suite('replaceVariablesInText');

ReplaceVariablesInText(
  'should replace variables in strings inside curly brackets with the variables supplied',
  () => {
    assert.type(replaceVariablesInText, 'function');
    assert.type(
      replaceVariablesInText('Hello {{name}}', { name: 'world' }),
      'string'
    );

    assert.snapshot(
      replaceVariablesInText('Hello {{name}}', { name: 'John' }),
      'Hello John'
    );
    assert.snapshot(
      replaceVariablesInText('Example translation {{keyOne}} {{keyTwo}}.', {
        keyOne: 'with',
        keyTwo: 'variables',
      }),
      'Example translation with variables.'
    );
    assert.snapshot(
      replaceVariablesInText(
        'Example translation with a {{ variableName }} with spaces around it.',
        {
          variableName: 'variableKey',
        }
      ),
      'Example translation with a variableKey with spaces around it.'
    );
  }
);

ReplaceVariablesInText(
  "should leave curly braces in place if they aren't closed",
  () => {
    assert.snapshot(
      replaceVariablesInText('Example translation {{', {}),
      'Example translation {{'
    );
  }
);

ReplaceVariablesInText(
  'should throw an error if no translation string is provided',
  () => {
    const fn = () => replaceVariablesInText(undefined as any, {});
    assert.throws(fn);
  }
);

ReplaceVariablesInText('should handle pluralization', () => {
  const patients = (n: number) =>
    replaceVariablesInText(
      '{{admissions_on_date_of_reporting}} {{admissions_on_date_of_reporting, plural, patients}}',
      {
        admissions_on_date_of_reporting: n,
        patients: {
          plural: 'patients',
          singular: 'patient',
        },
      }
    );

  assert.snapshot(patients(1), '1 patient');
  assert.snapshot(patients(2), '2 patients');
});

ReplaceVariablesInText.run();
