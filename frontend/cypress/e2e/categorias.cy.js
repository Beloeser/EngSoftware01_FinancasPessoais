describe("Categorias", () => {
  beforeEach(() => {
    cy.login();
  });

  it("adiciona e remove uma categoria", () => {
    cy.visit("/categories");

    cy.get('input[placeholder="Nome da categoria *"]').type("Lazer E2E");
    cy.contains("button", "Adicionar").click();
    cy.contains("Lazer E2E").should("be.visible");

    cy.contains("button", "Remover").click();
    cy.contains("Lazer E2E").should("not.exist");
    cy.contains("Nenhuma categoria cadastrada.").should("be.visible");
  });

  it("não permite cadastrar categoria duplicada", () => {
    cy.visit("/categories");

    cy.get('input[placeholder="Nome da categoria *"]').type("Casa E2E");
    cy.contains("button", "Adicionar").click();
    cy.get('input[placeholder="Nome da categoria *"]').type("Casa E2E");
    cy.contains("button", "Adicionar").click();

    cy.contains("Categoria já cadastrada.").should("be.visible");
  });
});
