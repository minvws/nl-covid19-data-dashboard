context("Over risiconiveau's", () => {
  before(() => {
    cy.beforeGeneralTests('over-risiconiveaus');
  });

  it('dummy to trigger the before() tests', () => {
    expect(true);
  });
});
