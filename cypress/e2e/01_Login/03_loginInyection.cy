import { Route } from '../dataTests';

describe('Pruebas de Inyección SQL en Login', () => {
    
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1536, 960);
    });

    const injectionData = [
        "' OR '1'='1",
        "' OR 'a'='a",
        "'; DROP TABLE users; --",
        "' OR EXISTS(SELECT * FROM users WHERE username='admin')",
        "' -- comentario"
    ];

    injectionData.forEach((input) => {
        it(`Prueba de inyección con el input: ${input}`, () => {
            cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(input);
            cy.get(':nth-child(2) > .relative > .w-full').clear().type('password');
            cy.get('.flex-col > .flex > .w-56').click();
            
            // Verifica que el mensaje de error esté visible y contenga el texto esperado
            cy.get('.text-red-500')
                .should('be.visible')
                .and('contain', 'Correo electrónico no válido');
        });
    });
});
