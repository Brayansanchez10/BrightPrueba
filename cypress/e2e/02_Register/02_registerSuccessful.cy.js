import { Route, NameReg, LastnameReg, UserReg, EmailReg, PasswordReg, RepeatPasswordReg } from '../dataTests';

describe('Realizar registro', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
        cy.get('.mb-5 > .text-xl').click();
    });

    it('Registrar usuario', () => {
        cy.get('.flex-col > :nth-child(1) > :nth-child(1) > .w-full').type(NameReg);
        cy.get('.flex-col > :nth-child(1) > :nth-child(2) > .w-full').type(LastnameReg);
        cy.get(':nth-child(2) > div.w-full > .w-full').type(UserReg);
        cy.get(':nth-child(3) > .w-full').type(EmailReg);
        cy.get(':nth-child(4) > .relative > .w-full').type(PasswordReg);
        cy.get(':nth-child(5) > .relative > .w-full').type(RepeatPasswordReg);
        cy.get(':nth-child(6) > .w-full').select("2");
        cy.get('.w-48').click();
        cy.get('.swal2-popup').contains(/Usuario creado exitosamente, Por favor revisa tu correo para activar la cuenta|User created successfully, Please check your email to activate your account/);
        cy.get('.flex-col > :nth-child(1) > .w-full').type(EmailReg);
        cy.get(':nth-child(2) > .relative > .w-full').type(PasswordReg);
        cy.get('.flex-col > .flex > .w-56').click();
    });
});
