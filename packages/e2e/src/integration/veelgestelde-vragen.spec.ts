context('Veelgestelde vragen', () => {
  before(() => {
    cy.beforeGeneralTests('veelgestelde-vragen');
  });

  it('dummy to trigger the before() tests', () => {
    expect(true);
  });
});
