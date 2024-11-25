import { Route, Email } from '../dataTests'

function FormElements() {
    cy.get('.p-6 > .text-2xl > p').contains(/Ingresa a tu cuenta|Login your account/).should("be.visible");
    cy.get('.flex-col > :nth-child(1) > .flex').contains(/Correo electrónico|Email/).should("be.visible");
    cy.get('.flex-col > :nth-child(1) > .w-full').should("be.visible");
    cy.get('.p-6 > .flex-col > :nth-child(2) > .flex').contains(/Contraseña|Password/).should("be.visible");
    cy.get(':nth-child(2) > .relative > .w-full').should("be.visible");
    cy.get('.text-end > .text-gray-600').contains(/Has olvidado tu contraseña|Forgot password/).should("be.visible");
    cy.get('.flex-col > .flex > .w-56').contains(/INICIAR SESIÓN|LOGIN/).should("be.visible");
    cy.get('.mb-5 > .text-xl').contains(/CREAR CUENTA|CREATE ACCOUNT/).should("be.visible");
};

function Responsive() {
    cy.log('samsung-s10');
    cy.viewport('samsung-s10');
    FormElements();
    cy.log('samsung-note9');
    cy.viewport('samsung-note9');
    FormElements();
    cy.log('ipad-mini');
    cy.viewport('ipad-mini');
    FormElements();
    cy.log('macbook-13');
    cy.viewport('macbook-13');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    FormElements();
    cy.log('macbook-11');
    cy.viewport('macbook-11');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    FormElements();
    cy.log('macbook-15');
    cy.viewport('macbook-15');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    FormElements();
    cy.viewport(1536, 960);
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
}

describe('Pruebas de validacion de login', () => {

    const dimensions = ['samsung-s10', 'samsung-note9', 'ipad-mini', 'macbook-13', 'macbook-11', 'macbook-15'];

    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
    });

    it('Validacion de formulario', () => {
        Cypress._.times(2, () => {
            cy.get('.max-w-7xl > .bg-white');
            FormElements();
            cy.get('.relative > .block').click();
        });
    });

    it('Validacion de responsividad', () => {
        cy.get('.max-w-7xl > .bg-white').should("be.visible");
        cy.get('.relative > .bg-gradient-to-r').should("be.visible");
        cy.get('.p-6').should("be.visible");
        Cypress._.times(2, () => {
            Responsive();
            cy.get('.relative > .block').click();
        });
    });

    it('Validacion de visualizacion de alertas o campos vacios', () => {
        cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
        Cypress._.times(2, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').type(' ')
            cy.get(':nth-child(1) > .flex > .relative').click().should('be.visible');
            cy.get(':nth-child(1) > .flex > .relative > .absolute').contains(/El correo electrónico es obligatorio|Email is required/);
            cy.get('.flex-col > :nth-child(2) > .flex > .relative').click().should('be.visible');
            cy.get('.flex-col > :nth-child(2) > .flex > .relative > .absolute').contains(/La contraseña es obligatoria|Password is required/);
            cy.get('.relative > .block').click();
        });
    });

    it('Validacion de alertas en campos con un solo caracter', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').clear().type('H');
            cy.get(':nth-child(2) > .relative > .w-full').clear().type('H');
            cy.get(':nth-child(1) > .flex > .relative').click().should('be.visible');
            cy.get(':nth-child(1) > .flex > .relative > .absolute').contains(/Correo electrónico no válido|Invalid email/);
            cy.get('.relative > .block').click();
        });
    });

    it('Validacion de alerta de usuario no existente', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').type('testuser@gmail.com');
            cy.get(':nth-child(2) > .relative > .w-full').type('H');
            cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
            cy.get('.swal2-popup').contains('User not found').should('be.visible');
            cy.get('#swal2-title').contains(/Error al iniciar sesion|Login error/).should('be.visible');
            cy.get('.swal2-confirm').click();
            cy.get('.relative > .block').click();
        });
    });

    it('Validacion de usuario existente y contraseña equivocada', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').type(Email);
            cy.get(':nth-child(2) > .relative > .w-full').type('H');
            cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
            cy.get('.swal2-popup').contains('Incorrect Password').should('be.visible');
            cy.get('#swal2-title').contains(/Error al iniciar sesion|Login error/).should('be.visible');
            cy.get('.swal2-confirm').click();
            cy.get('.relative > .block').click();
        });
    });

    dimensions.forEach((dimensions) => {
        it(`Pruebas de alertas responsivas de campos vacios en: ${dimensions}`, () => {
            cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
            Cypress._.times(2, () => {
                cy.viewport(dimensions);
                cy.get('.flex-col > :nth-child(1) > .w-full').type(' ')
                cy.get(':nth-child(1) > .flex > .relative').click().should('be.visible');
                cy.get(':nth-child(1) > .flex > .relative > .absolute').contains(/El correo electrónico es obligatorio|Email is required/);
                cy.get('.flex-col > :nth-child(2) > .flex > .relative').click().should('be.visible');
                cy.get('.flex-col > :nth-child(2) > .flex > .relative > .absolute').contains(/La contraseña es obligatoria|Password is required/);
                cy.get('.relative > .block').click();
            });
        });
    });

    dimensions.forEach((dimensions) => {
        it(`Pruebas de alertas responsivas en campos con un solo caracter en: ${dimensions}`, () => {
            Cypress._.times(2, () => {
                cy.viewport(dimensions);
                cy.get('.flex-col > :nth-child(1) > .w-full').clear().type('H');
                cy.get(':nth-child(2) > .relative > .w-full').clear().type('H');
                cy.get(':nth-child(1) > .flex > .relative').click().should('be.visible');
                cy.get(':nth-child(1) > .flex > .relative > .absolute').contains(/Correo electrónico no válido|Invalid email/);
                cy.get('.relative > .block').click();
            });
        });
    });

    dimensions.forEach((dimensions) => {
        it(`Pruebas de alertas responsivas de usuario no existente en: ${dimensions}`, () => {
            Cypress._.times(2, () => {
                cy.viewport(dimensions);
                cy.get('.flex-col > :nth-child(1) > .w-full').type('testuser@gmail.com');
                cy.get(':nth-child(2) > .relative > .w-full').type('H');
                cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
                cy.get('.swal2-popup').contains('User not found').should('be.visible');
                cy.get('#swal2-title').contains(/Error al iniciar sesion|Login error/).should('be.visible');
                cy.get('.swal2-confirm').click();
                cy.get('.relative > .block').click();
            });
        });
    });

    dimensions.forEach((dimensions) => {
        it(`Pruebas de alertas responsivas de usuario existente y contraseña equivocada en: ${dimensions}`, () => {
            Cypress._.times(2, () => {
                cy.viewport(dimensions);
                cy.get('.flex-col > :nth-child(1) > .w-full').type(Email);
                cy.get(':nth-child(2) > .relative > .w-full').type('H');
                cy.get('.flex-col > .flex > .w-56').should('be.visible').click();
                cy.get('.swal2-popup').contains('Incorrect Password').should('be.visible');
                cy.get('#swal2-title').contains(/Error al iniciar sesion|Login error/).should('be.visible');
                cy.get('.swal2-confirm').click();
                cy.get('.relative > .block').click();
            });
        });
    });

});
