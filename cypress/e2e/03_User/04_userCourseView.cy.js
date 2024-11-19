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
        cy.get('.grid');
        cy.get('.flex-grow > .text-xl').should('be.visible');
        cy.get('.bg-secondary > .mt-4').should('be.visible').click();
    });

    it('Pruebas visualizacion curso', () => {
        cy.get('.z-0 > .absolute').should('be.visible');
        cy.get('.bg-purple-600').should('be.visible');
        cy.get('.bg-blue-600').should('be.visible');
        cy.get('.bg-green-600').should('be.visible');
        cy.get('.text-3xl').contains(/Temario y recursos|Syllabus and Resources/)
        cy.get('.text-3xl').contains(/Acerca del Creador|About the Creator/)
        cy.get('.p-6')
        cy.get('body').then(($body) => {
            if ($body.find('.ant-collapse-header').length > 0) {
                cy.log('Hay recursos');
            } else {
                cy.get('.bg-white').contains(/No hay recursos disponibles para este curso.|There are no resources available for this course./).should('be.visible')
                cy.log('No hay recursos');
            }
        })
    });

    it('Pruebas de botones', () => {
        cy.get('.bg-purple-600').should('be.visible');
        cy.get('.bg-blue-600').should('be.visible');
        cy.get('.bg-green-600').should('be.visible');
        cy.get('.bg-blue-600').should('be.visible').click();
        cy.get('.bg-green-600').should('be.visible').click();
        cy.get('.bg-secondary').should('be.visible')
        cy.get('.text-white').contains(/MENU DE OPCIONES|OPTIONS MENU/).should('be.visible')
        cy.get('.space-y-2 > .w-full').should('be.visible').click();
        cy.get('.bg-purple-600').should('be.visible').click();
    });

});