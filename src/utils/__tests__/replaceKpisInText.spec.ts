import { replaceKpisInText } from '../replaceKpisInText';

describe('Util: replaceKpisInText', () => {
  it('Should embed nothing if there are no KPIs', () => {
    expect(replaceKpisInText('Example text string', [])).toMatchInlineSnapshot(
      `"Example text string"`
    );
  });

  it('Should embed KPI if there is one', () => {
    expect(
      replaceKpisInText('Example text {{foo}}', [
        {
          name: 'foo',
          value: '123',
        },
      ])
    ).toMatchInlineSnapshot(
      `"Example text <span class=\\" inline-kpi\\">123</span>"`
    );
  });

  it('Should embed nothing if the KPI is not in the text', () => {
    expect(
      replaceKpisInText('Example text', [
        {
          name: 'bar',
          value: '890',
        },
      ])
    ).toMatchInlineSnapshot(`"Example text"`);
  });

  it('Should use empty string if KPI is not provided', () => {
    expect(replaceKpisInText('Example text {{zap}}', [])).toMatchInlineSnapshot(
      `"Example text "`
    );
  });

  it('Should replace multiple KPIs', () => {
    expect(
      replaceKpisInText('Example text {{foo}} = {{bar}}', [
        {
          name: 'foo',
          value: '123',
        },
        {
          name: 'bar',
          value: '890',
        },
      ])
    ).toMatchInlineSnapshot(
      `"Example text <span class=\\" inline-kpi\\">123</span> = <span class=\\" inline-kpi\\">890</span>"`
    );
  });

  it('Should replace KPis with extra classNames', () => {
    expect(
      replaceKpisInText('Computer: {{answer}}', [
        {
          name: 'answer',
          value: '42',
          className: 'the-answer-to-life-the-universe-and-everything',
        },
      ])
    ).toMatchInlineSnapshot(
      `"Computer: <span class=\\"the-answer-to-life-the-universe-and-everything inline-kpi\\">42</span>"`
    );
  });
});
