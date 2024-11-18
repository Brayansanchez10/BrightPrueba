import { Route, EmailUser, PasswordUser } from '../dataTests';

describe('Pruebas de visualizacion de mis cursos', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(EmailUser);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(PasswordUser);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.p-2 > :nth-child(1) > .text-white').contains("BRIGHTMIND").should('be.visible');
        cy.get('[href="/MyCourses"]').contains(/Mis cursos|My Courses/).should('be.visible').click();
    });

    it('Pruebas de disponibilidad de curso', () => {
        cy.get('body').then(($body) => {
            if ($body.find('.grid').length > 0) {
                cy.log('Hay cursos disponibles');
                cy.get('.flex-grow > .text-xl').should('be.visible')
                cy.get('.bg-secondary > .mt-4').should('be.visible')
            } else {
                cy.get('.bg-secondary').should('be.visible')
                cy.get('.bg-secondary > .text-xl').contains(/No estás inscrito en ningún curso aún.|You are not enrolled in any courses yet./)
                cy.log('No estas registrado a ningun curso');
            }
        });
    });

});

