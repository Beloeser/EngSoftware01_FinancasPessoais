describe("Transações", () => {
  beforeEach(() => {
    cy.login();
  });

  it("cria uma nova transação", () => {
    const categoryName = `Receitas E2E ${Date.now()}`;

    cy.visit("/categories");
    cy.get('input[placeholder="Nome da categoria *"]').type(categoryName);
    cy.contains("button", "Adicionar").click();
    cy.contains(categoryName).should("be.visible");

    cy.visit("/dashboard");
    cy.get('input[name="description"]').type("Salário E2E");
    cy.get('input[name="amount"]').type("1500");
    cy.get('select[name="type"]').select("income");
    cy.get('input[name="date"]').type("2024-05-10");
    cy.get('select[name="categoryId"]').select(categoryName);
    cy.contains("button", "Salvar").click();

    cy.contains("Salário E2E").should("be.visible");
    cy.contains(categoryName).should("be.visible");
  });

  it("remove uma transação após confirmação", () => {
    cy.visit("/dashboard");
    cy.get('input[name="description"]').type("Conta E2E");
    cy.get('input[name="amount"]').type("99");
    cy.get('select[name="type"]').select("expense");
    cy.get('input[name="date"]').type("2024-05-11");
    cy.contains("button", "Salvar").click();
    cy.contains("Conta E2E").should("be.visible");

    cy.contains("Conta E2E")
      .parent()
      .parent()
      .within(() => {
        cy.contains("button", "Remover").click();
        cy.contains("button", "Confirmar").click();
      });

    cy.contains("Conta E2E").should("not.exist");
  });
});
