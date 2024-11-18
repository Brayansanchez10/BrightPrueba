import { Route, Email, Password, EmailUser, PasswordUser } from '../dataTests';

describe('Ingreso al sistema', () => {

    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
    });

    const emails = [Email, EmailUser];
    const passwords = [Password, PasswordUser];

    emails.forEach((email, index) => {
        const password = passwords[index];

        it(`Acceso al sistema con correo ${email} y contraseña ${password}`, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(email);
            cy.get(':nth-child(2) > .relative > .w-full').clear().type(password);
            cy.get('.flex-col > .flex > .w-56').click();
        });
    });

});

