import { Route, EmailUser, PasswordUser } from '../dataTests';

describe('Pruebas generales de la vista', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(EmailUser);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(PasswordUser);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.p-2 > :nth-child(1) > .text-white').contains("BRIGHTMIND").should('be.visible');
    });

    it('Pruebas de navbar', () => {
        Cypress._.times(2, () => {
            cy.get('[href="/AllCourses"]').contains(/CURSOS|COURSES/).should('be.visible').click();
            cy.get('[href="/MyCourses"]').contains(/Mis cursos|My Courses/).should('be.visible').click();
            cy.get('body').then(($body) => {
                if ($body.find('[href="/Forum"]').length > 0) {
                    cy.get('[href="/Forum"]').contains(/Foro|Forum/).should('be.visible').click();
                } else {
                    cy.log('El foro está desactivado');
                }
            });
            cy.get('[href="/Home"]').contains(/INICIO|HOME/).should('be.visible').click();
            cy.get('.relative > .block').click();
        });
    });

    it('Pruebas de perfil', () => {
        Cypress._.times(2, () => {
            cy.get('.h-14').click();
            cy.get('.right-2 > .relative').should('be.visible')
            cy.get('[href="/profile/2"]').contains(/Ver mi perfil|View my profile/).should('be.visible').click();
            cy.get('.h-14').click();
            cy.get('[href="/Account"]').contains(/Configurar perfil|Configure Profile/).should('be.visible').click();
            cy.get('.relative > .block').click();
        });
    });

    it('Pruebas de footer', () => {
        Cypress._.times(2, () => {
            cy.get('.container > .flex').contains(/© 2024 Mesadoko - BrightMind. Todos los derechos reservados.|© 2024 Mesadoko - BrightMind. All rights reserved./).should('be.visible');
            cy.get('.lucide').click();
            cy.get('.container').should('be.visible');
            cy.get('.grid-cols-1 > :nth-child(1) > .text-base').contains(/Aprende con BrightMind|Learn with BrightMind/).should('be.visible');
            cy.get('.grid-cols-1 > .flex-col.items-center').should('be.visible');
            cy.get('.flex-col.items-center > .flex > .text-xs').contains(/Desarrollado en Disruptive|Developed at Disruptive/).should('be.visible');
            cy.get('.text-white > .lucide').click()
            cy.get('.relative > .block').click();
            cy.wait(200);
        });
    });

    it('Pruebas de footer en todos los apartados', () => {
        cy.get('[href="/AllCourses"]').contains(/CURSOS|COURSES/).should('be.visible').click();
        cy.get('.container > .flex').should('be.visible')
        cy.get('[href="/MyCourses"]').contains(/Mis cursos|My Courses/).should('be.visible').click();
        cy.get('.container > .flex').should('be.visible')
        cy.get('body').then(($body) => {
            if ($body.find('[href="/Forum"]').length > 0) {
                cy.get('[href="/Forum"]').contains(/Foro|Forum/).should('be.visible').click();
                cy.get('.container > .flex').should('be.visible')
            } else {
                cy.log('El foro está desactivado');
            }
        });
        cy.get('.h-14').click();
        cy.get('.right-2 > .relative').should('be.visible')
        cy.get('[href="/profile/2"]').contains(/Ver mi perfil|View my profile/).should('be.visible').click();
        cy.get('.container > .flex').should('be.visible')
        cy.get('.h-14').click();
        cy.get('[href="/Account"]').contains(/Configurar perfil|Configure Profile/).should('be.visible').click();
        cy.get('[href="/Home"]').contains(/INICIO|HOME/).should('be.visible').click();
        cy.get('.container > .flex').should('be.visible')
    });

});
