describe("Categorias", () => {
  beforeEach(() => {
    cy.login();
  });

  it("adiciona e remove uma categoria", () => {
    const categoryName = `Lazer E2E ${Date.now()}`;

    cy.visit("/categories");

    cy.get('input[placeholder="Nome da categoria *"]').type(categoryName);
    cy.contains("button", "Adicionar").click();
    cy.contains(categoryName).should("be.visible");

    cy.contains(categoryName)
      .parent()
      .within(() => {
        cy.contains("button", "Remover").click();
      });
    cy.contains(categoryName).should("not.exist");
  });

  it("não permite cadastrar categoria duplicada", () => {
    const categoryName = `Casa E2E ${Date.now()}`;

    cy.visit("/categories");

    cy.get('input[placeholder="Nome da categoria *"]').type(categoryName);
    cy.contains("button", "Adicionar").click();
    cy.get('input[placeholder="Nome da categoria *"]').type(categoryName);
    cy.contains("button", "Adicionar").click();

    cy.contains("Categoria já cadastrada.").should("be.visible");
  });
});
