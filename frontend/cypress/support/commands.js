// Comando customizado para login via UI
Cypress.Commands.add("login", (email = "usuario@email.com", password = "senha123") => {
  cy.visit("/login");
  cy.get("input[type=email]").type(email);
  cy.get("input[type=password]").type(password);
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/dashboard");
});
