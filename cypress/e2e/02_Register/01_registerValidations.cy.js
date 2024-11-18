import { Route } from '../dataTests'

function RegisterElements() {
    cy.get('.max-w-7xl > .bg-white').should('be.visible');
    cy.get(':nth-child(1) > :nth-child(1) > .text-lg').contains(/Nombres|First Names/).should('be.visible');
    cy.get('.flex-col > :nth-child(1) > :nth-child(2) > .text-lg').contains(/Apellidos|Last Names/).should('be.visible');
    cy.get('.flex-col > :nth-child(1) > :nth-child(1) > .w-full').should('be.visible');
    cy.get('.flex-col > :nth-child(1) > :nth-child(2) > .w-full').should('be.visible');
    cy.get('div.w-full > .text-lg').contains(/Nombre de usuario|Username/).should('be.visible');
    cy.get(':nth-child(2) > div.w-full > .w-full').should('be.visible');
    cy.get(':nth-child(3) > .text-lg').contains(/Correo electrónico|Email/).should('be.visible');
    cy.get(':nth-child(3) > .w-full').should('be.visible');
    cy.get(':nth-child(4) > .text-lg').contains(/Contraseña|Password/).should('be.visible');
    cy.get(':nth-child(4) > .relative > .w-full').should('be.visible');
    cy.get(':nth-child(5) > .text-lg').contains(/Repite la contraseña|Repeat password/).should('be.visible');
    cy.get(':nth-child(5) > .relative > .w-full').should('be.visible');
    cy.get(':nth-child(6) > .text-lg').contains(/Selecciona tu entidad|Select your entity/).should('be.visible');
    cy.get(':nth-child(6) > .w-full').should('be.visible')
    cy.get('.w-48').should('be.visible');
    cy.get('.mt-3.mb-2').contains(/Ya estás registrado|Already registered/).should('be.visible');
    cy.get('a > .text-xl').contains(/Iniciar sesión|Login/).should('be.visible');
}

function Responsive() {
    cy.log('samsung-s10');
    cy.viewport('samsung-s10');
    RegisterElements();
    cy.log('samsung-note9');
    cy.viewport('samsung-note9');
    RegisterElements();
    cy.log('ipad-mini');
    cy.viewport('ipad-mini');
    RegisterElements();
    cy.log('macbook-13');
    cy.viewport('macbook-13');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    RegisterElements();
    cy.log('macbook-11');
    cy.viewport('macbook-11');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    RegisterElements();
    cy.log('macbook-15');
    cy.viewport('macbook-15');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    RegisterElements();
}

describe('Pruebas de validacion register', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.mb-5 > .text-xl').click()
    });

    it('Pruebas de validacion de vista', () => {
        cy.get('.relative > .bg-gradient-to-r').should('be.visible');
        RegisterElements()
    });

    it('Pruebas de responsividad', () => {
        Responsive();
        cy.get('.relative > .block').click();
        Responsive();
    });

    it('Pruebas de validacion de botones', () => {
        cy.get(':nth-child(4) > .relative > .absolute').click();
        cy.get(':nth-child(5) > .relative > .absolute > .svg-inline--fa').click();
        cy.get('.w-48').click();
    });
});

describe('Pruebas de validacion de alertas register', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.mb-5 > .text-xl').click()
    });

    it('Campos vacios', () => {
        cy.get('.w-48').click();
        cy.get(':nth-child(1) > :nth-child(1) > .text-red-500').contains(/Nombre es requerido|First name is required/).should('be.visible');
        cy.get(':nth-child(2) > .text-red-500').contains(/Apellido es requerido|Last name is required/).should('be.visible');
        cy.get('div.w-full > .text-red-500').contains(/Nombre de usuario es requerido|Username is required/).should('be.visible');
        cy.get(':nth-child(3) > .text-red-500').contains(/Correo electrónico es requerido|Email is required/).should('be.visible');
        cy.get(':nth-child(4) > .text-red-500').contains(/Contraseña es requerida|Password is required/).should('be.visible');
        cy.get(':nth-child(5) > .text-red-500').contains(/Repite la contraseña|Repeat password/).should('be.visible');
    });

    it('Campos errados', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > :nth-child(1) > :nth-child(1) > .w-full').clear().type("h");
            cy.get('.flex-col > :nth-child(1) > :nth-child(2) > .w-full').clear().type("h");
            cy.get(':nth-child(2) > div.w-full > .w-full').clear().type("h");
            cy.get(':nth-child(3) > .w-full').clear().type("h");
            cy.get(':nth-child(4) > .relative > .w-full').clear().type("h");
            cy.get(':nth-child(5) > .relative > .w-full').clear().type("b");
            cy.get('div.w-full > .text-red-500').contains(/El nombre de usuario debe tener al menos 4 caracteres|Username must be at least 4 characters long/).should('be.visible');
            cy.get(':nth-child(3) > .text-red-500').contains(/Correo electrónico inválido|Invalid email/).should('be.visible');
            cy.get(':nth-child(4) > .text-red-500').contains(/La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial|Password must contain at least one uppercase, one lowercase, one number, and one special character/).should('be.visible');
            cy.get(':nth-child(4) > .relative > .absolute > .svg-inline--fa').click();
            cy.get(':nth-child(5) > .relative > .absolute > .svg-inline--fa').click();
            cy.get(':nth-child(5) > .text-red-500').contains(/Las contraseñas deben coincidir|Passwords must match/).should('be.visible');
            cy.get('.relative > .block').click();
        });
    });

    it('Prueba datos correctos sin contar la entidad', () => {
        cy.get('.flex-col > :nth-child(1) > :nth-child(1) > .w-full').type("David");
        cy.get('.flex-col > :nth-child(1) > :nth-child(2) > .w-full').type("Marin");
        cy.get(':nth-child(2) > div.w-full > .w-full').type("David en pruebas");
        cy.get(':nth-child(3) > .w-full').type("davidelm42@gmail.com");
        cy.get(':nth-child(4) > .relative > .w-full').type("CafeconLeche012**");
        cy.get(':nth-child(5) > .relative > .w-full').type("CafeconLeche012**");
        cy.get('.w-48').click();
        cy.get('.swal2-popup').contains("Error").should('be.visible');
    });
});

