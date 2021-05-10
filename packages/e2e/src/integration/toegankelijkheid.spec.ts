context('Toegankelijkheid', () => {
  before(() => {
    cy.beforeGeneralTests('toegankelijkheid');
  });

  it('dummy to trigger the before() tests', () => {
    expect(true);
  });
});
