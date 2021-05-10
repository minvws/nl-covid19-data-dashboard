context('Verantwoording', () => {
  before(() => {
    cy.beforeGeneralTests('verantwoording');
  });

  it('dummy to trigger the before() tests', () => {
    expect(true);
  });
});
