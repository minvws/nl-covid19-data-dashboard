import { createFormatting } from '@corona-dashboard/common';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { replaceVariablesInText } from '../replace-variables-in-text';
import * as M from '../replace-variables-in-text';
import * as sinon from 'sinon';

const ReplaceVariablesInText = suite('replaceVariablesInText');

ReplaceVariablesInText.after.each(() => {
  sinon.restore();
});

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

ReplaceVariablesInText(
  'should throw an error if an unknown command is passed',
  () => {
    const fn = () =>
      replaceVariablesInText('{{test, formatBlurb}}', { test: undefined });
    assert.throws(fn);
  }
);

ReplaceVariablesInText(
  'should return an error string if shouldValidate is false and an empty values parameter is passed',
  () => {
    sinon.replace(M, 'shouldValidate', false);

    assert.is(replaceVariablesInText('{{test}}', {}), `[#ERROR {{test}}]`);
  }
);

ReplaceVariablesInText(
  'should throw and error if no value was supplied for placeholder',
  () => {
    assert.throws(() => replaceVariablesInText('{{test}}', {}));
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

ReplaceVariablesInText(
  'should throw when the pluralization key is missing',
  () => {
    const patients = (n: number) =>
      replaceVariablesInText(
        '{{admissions_on_date_of_reporting}} {{admissions_on_date_of_reporting, plural, patients}}',
        {
          admissions_on_date_of_reporting: n,
        }
      );

    assert.throws(() => patients(1));
  }
);

ReplaceVariablesInText(
  'should throw when the pluralization value is missing',
  () => {
    const patients = () =>
      replaceVariablesInText(
        '{{admissions_on_date_of_reporting}} {{admissions_on_date_of_reporting, plural, patients}}',
        {
          admissions_on_date_of_reporting: undefined,
          patients: {
            plural: 'patients',
            singular: 'patient',
          },
        }
      );

    assert.throws(() => patients());
  }
);

ReplaceVariablesInText('should use formatters when passed', () => {
  const formatters = createFormatting('nl-NL', {
    date_today: 'vandaag',
    date_yesterday: 'gisteren',
    date_day_before_yesterday: 'eergisteren',
  });

  assert.is(
    replaceVariablesInText('{{test, formatNumber}}', { test: 123 }, formatters),
    '123'
  );
});

ReplaceVariablesInText(
  'should throw when a formatter is passed but the value is undefined',
  () => {
    const formatters = createFormatting('nl-NL', {
      date_today: 'vandaag',
      date_yesterday: 'gisteren',
      date_day_before_yesterday: 'eergisteren',
    });

    assert.throws(
      () =>
        replaceVariablesInText(
          '{{test, formatNumber}}',
          { test: undefined },
          formatters
        ),
      'No value was supplied for command number value test in test. Text: {{test, formatNumber}}'
    );
  }
);

ReplaceVariablesInText.run();
