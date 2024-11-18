import { Route, Email, Password } from '../dataTests'

function LoginElements() {
    cy.get('.max-w-7xl > .bg-white');
    cy.get('.p-6').should("be.visible");
    cy.get('.p-6 > .text-2xl > p').contains(/Ingresa a tu cuenta|Login your account/).should("be.visible");
    cy.get('.flex-col > :nth-child(1) > .text-lg').contains(/Correo electrónico|Email/).should("be.visible");
    cy.get('.flex-col > :nth-child(1) > .w-full').should("be.visible");
    cy.get('.p-6 > .flex-col > :nth-child(2) > .text-lg').contains(/Contraseña|Password/).should("be.visible");
    cy.get(':nth-child(2) > .relative > .w-full').should("be.visible");
    cy.get('.text-end > .text-gray-600').contains(/Has olvidado tu contraseña|Forgot password/).should("be.visible");
    cy.get('.flex-col > .flex > .w-56').should("be.visible");
    cy.get('.mb-5 > .text-xl').contains(/CREAR CUENTA|CREATE ACCOUNT/).should("be.visible");
}

function Responsive() {
    cy.log('samsung-s10');
    cy.viewport('samsung-s10');
    LoginElements();
    cy.log('samsung-note9');
    cy.viewport('samsung-note9');
    LoginElements();
    cy.log('ipad-mini');
    cy.viewport('ipad-mini');
    LoginElements();
    cy.log('macbook-13');
    cy.viewport('macbook-13');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    LoginElements();
    cy.log('macbook-11');
    cy.viewport('macbook-11');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    LoginElements();
    cy.log('macbook-15');
    cy.viewport('macbook-15');
    cy.get('.relative > .bg-gradient-to-r').should("be.visible");
    LoginElements();
}

describe('Pruebas de Validacion Login', () => {

    beforeEach(() => {
        cy.visit(Route);
    });

    it('Prueba de validacion de vista', () => {
        cy.viewport(1536, 960);
        cy.get('.relative > .bg-gradient-to-r').should("be.visible");
        LoginElements();
    });

    it('Pruebas de validacion responsividad', () => {
        Responsive();
        cy.get('.relative > .block').click();
        Responsive();
    });

    it('Pruebas de validacion de botones', () => {
        cy.viewport(1536, 960);
        cy.get('.text-end > .text-gray-600').click();
        cy.get('.text-purple-800 > span').click();
        cy.get('a > .text-xl').click();
        cy.get('.mb-5 > .text-xl').click();
        cy.get('a > .text-xl').click();
        cy.get(':nth-child(2) > .relative > .w-full').type("hola mundo");
        cy.get(':nth-child(2) > .relative > .absolute').click();
        cy.get('.relative > .block').click();
    });

});

describe('Pruebas de validacion de alertas login', () => {

    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
    });

    it('Campos vacios', () => {
        cy.get('.flex-col > .flex > .w-56').click()
        cy.get(':nth-child(1) > .text-red-500').should("be.visible");
        cy.get(':nth-child(2) > .text-red-500').should("be.visible");
    });

    it('Campos erroneos', () => {
        cy.get('.flex-col > :nth-child(1) > .w-full').type("correo")
        cy.get(':nth-child(2) > .relative > .w-full').type("contraseña");
        cy.get('.text-red-500').should('be.visible');
        cy.get('.flex-col > :nth-child(1) > .w-full').type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').type("contraseña");
    });

    it('Usuario inexistente', () => {
        cy.get('.flex-col > :nth-child(1) > .w-full').type(Email + "12");
        cy.get(':nth-child(2) > .relative > .w-full').type("contraseña");
        cy.get('.flex-col > .flex > .w-56').click();
        cy.get('.swal2-popup').contains("User not found");
    });

    it('Usuario existente con contraseña erronea', () => {
        cy.get('.flex-col > :nth-child(1) > .w-full').type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').type(Password + "12");
        cy.get('.flex-col > .flex > .w-56').click();
        cy.get('.swal2-popup').contains("Incorrect Password");
        cy.get('.swal2-confirm').click();
    });

});
