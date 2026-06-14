describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("exibe o formulário de login", () => {
    cy.get("input[type=email]").should("be.visible");
    cy.get("input[type=password]").should("be.visible");
  });

  it("faz login com credenciais válidas", () => {
    cy.get("input[type=email]").type("usuario@email.com");
    cy.get("input[type=password]").type("senha123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });

  it("exibe erro com credenciais inválidas", () => {
    cy.get("input[type=email]").type("errado@email.com");
    cy.get("input[type=password]").type("errado");
    cy.get("button[type=submit]").click();
    cy.contains(/inválid|incorret|erro/i).should("be.visible");
  });
});
