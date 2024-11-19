import { Route, EmailUser, PasswordUser } from '../dataTests';

describe('Pruebas de visualizacion del apartado cursos', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(EmailUser);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(PasswordUser);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.p-2 > :nth-child(1) > .text-white').contains("BRIGHTMIND").should('be.visible');
        cy.get('[href="/AllCourses"]').should('be.visible').click();
    });

    it('Pruebas de disponibilidad de cursos', () => {
        cy.get('.text-4xl').contains(/Cursos|Courses/).should('be.visible')
        cy.get('body').then(($body) => {
            if ($body.find('.hover-card').length > 0) {
                cy.log('Hay cursos disponibles');
            } else {
                cy.get('.bg-secondary').should('be.visible')
                cy.get('.bg-secondary > .text-xl').contains(/Próximamente|Coming soon/)
                cy.log('No hay cursos disponibles');
            }
        });
    });

    it('Pruebas de modal curso', () => {
        Cypress._.times(2, () => {
            cy.get('.relative > .w-full').click();
            cy.get('.bg-black > .bg-secondary').should('be.visible');
            cy.get('.justify-between > .flex-col > :nth-child(1) > span').contains(/horas|hours/).should('be.visible');
            cy.get('.flex-col > :nth-child(2) > span').contains(/secciones|sections/).should('be.visible');
            cy.get('.justify-between > .flex-col > :nth-child(3) > span').should('be.visible');
            cy.get('.bg-secondary > .absolute').should('be.visible').click();
            cy.get('.relative > .block').click();
        });
    });

})

