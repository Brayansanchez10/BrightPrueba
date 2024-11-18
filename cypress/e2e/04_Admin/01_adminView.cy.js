import { Route, Email, Password } from '../dataTests';

describe('Pruebas generales de la vista', () => {
    beforeEach (() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(Password);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
    });

    it('Primera prueba', () => {
        
    });
})
