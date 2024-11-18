import { Route, Email, Password } from '../dataTests';

describe('Pruebas generales de la vista', () => {
    beforeEach (() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(Password);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.flex-1').should('be.visible')
    });

    it('Pruebas de navbar', () => {
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/usuarios"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/Courses"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/Categories"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/ForumCategories"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/Entities"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/Roles"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/ProfileEditor"]').click();
        cy.wait(900);
        cy.get('.w-screen > .absolute').click();
        cy.get('.max-h-16 > :nth-child(1) > .fixed > .flex-col > [href="/admin"]').click();
    });
})
