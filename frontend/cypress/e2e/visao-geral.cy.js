describe("Visão Geral", () => {
  beforeEach(() => {
    cy.login();
  });

  it("exibe os cards de resumo e permite exportar PDF", () => {
    // Garante ao menos uma transação para a visão geral.
    cy.visit("/dashboard");
    cy.get('input[name="description"]').type("Receita Visão E2E");
    cy.get('input[name="amount"]').type("800");
    cy.get('select[name="type"]').select("income");
    cy.get('input[name="date"]').type("2024-06-01");
    cy.contains("button", "Salvar").click();
    cy.contains("Receita Visão E2E").should("be.visible");

    cy.contains("a", "Visão Geral").click();
    cy.url().should("include", "/visao-geral");

    cy.contains("Entradas").should("be.visible");
    cy.contains("Saídas").should("be.visible");
    cy.contains("Saldo").should("be.visible");
    cy.contains("button", "Exportar PDF").should("not.be.disabled");
  });
});
