context('Artikelen', () => {
  before(() => {
    cy.beforeGeneralTests('artikelen');
  });

  it('dummy to trigger the before() tests', () => {
    expect(true);
  });
});
