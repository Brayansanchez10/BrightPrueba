import { Route, Email, Password } from '../dataTests';

describe('Pruebas del apartado usuarios vista admin', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1736, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(Password);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.flex-1').should('be.visible')
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/Categories"]').click();
    });

    it('Vista general y todas las traducciones', () => {
        Cypress._.times(2, () => {
            cy.get('.text-3xl').contains(/Categorías|Categories/).should('be.visible');
            cy.get('.flex-col > .ant-btn').contains(/Crear Categoría|Create Category/).should('be.visible');
            cy.get('.justify-between > .flex-col > .flex').should('be.visible')
            cy.get('thead > tr > :nth-child(1)').contains('ID').should('be.visible');
            cy.get('thead > tr > :nth-child(2)').contains(/Nombre|Name/).should('be.visible');
            cy.get('.px-20').contains(/Descripción|Description/).should('be.visible');
            cy.get('.px-5').contains(/Acciones|Actions/).should('be.visible');
            cy.get('.flex-col > .ant-btn').click()
            cy.get('.p-5 > .text-2xl').contains(/Crear Categoría|Create Category/).should('be.visible');
            cy.get('.p-5 > :nth-child(2) > .text-lg').contains(/Nombre|Name/).should('be.visible');
            cy.get(':nth-child(2) > .ant-input').should('be.visible');
            cy.get('.mt-4 > .text-lg').contains(/Descripción|Description/).should('be.visible');
            cy.get('.mt-4 > .ant-input').should('be.visible');
            cy.get('.p-5 > .flex').contains(/Crear|Create/).should('be.visible');
            cy.get('.ant-modal-body > .absolute > .text-white').click();
            cy.get('.relative > .block').click();
        })
    });

    it.only('Crear categoria campos vacios', () => {
        cy.get('.flex-col > .ant-btn').click();
        cy.get('.p-5 > .flex').click()
    });

})