import { Route, Email, Password } from '../dataTests';

describe('Pruebas del apartado usuarios vista admin', () => {
    beforeEach(() => {
        cy.visit(Route);
        cy.viewport(1736, 960);
        cy.get('.flex-col > :nth-child(1) > .w-full').clear().type(Email);
        cy.get(':nth-child(2) > .relative > .w-full').clear().type(Password);
        cy.get('.flex-col > .flex > .w-56').click();
        cy.wait(5800);
        cy.get('.flex-1').should('be.visible')
        cy.get('.w-screen > .absolute').click();
        cy.get('.transition-all > :nth-child(1) > .fixed > .flex-col > [href="/usuarios"]').click();
    });

    it('Vista general y todas las traducciones', () => {
        Cypress._.times(2, () => {
            cy.get('.text-3xl').contains(/Usuarios|Users/).should('be.visible');
            cy.get('.flex-col > .ant-btn').contains(/Crear Usuario|Create User/).should('be.visible');
            cy.get('.justify-between > .flex-col > .flex > .bg-white').should('be.visible');
            cy.get('thead > tr > :nth-child(1)').contains('ID').should('be.visible');
            cy.get('thead > tr > :nth-child(2)').contains(/Rol|Role/).should('be.visible');
            cy.get('thead > tr > :nth-child(3)').contains(/Usuario|Username/).should('be.visible');
            cy.get('thead > tr > :nth-child(4)').contains(/Nombres|First Names/).should('be.visible');
            cy.get('thead > tr > :nth-child(5)').contains(/Apellidos|Last Names/).should('be.visible');
            cy.get('thead > tr > :nth-child(6)').contains(/Documento|Document/).should('be.visible');
            cy.get('thead > tr > :nth-child(7)').contains(/Correo Electrónico|Email/).should('be.visible');
            cy.get('thead > tr > :nth-child(8)').contains(/Estado|Status/).should('be.visible');
            cy.get('thead > tr > :nth-child(9)').contains(/Acciones|Actions/).should('be.visible');
            cy.get('.flex-col > .ant-btn').should('be.visible').click();
            cy.get(':nth-child(2) > .ant-row > .ant-form-item-label').contains(/Nombre de usuario|Username/).should('be.visible');
            cy.get('#username').should('be.visible');
            cy.get(':nth-child(3) > .ant-row > .ant-form-item-label').contains(/Nombres|First Names/).should('be.visible');
            cy.get('#firstNames').should('be.visible');
            cy.get(':nth-child(4) > .ant-row > .ant-form-item-label').contains(/Apellidos|Last Names/).should('be.visible');
            cy.get('#lastNames').should('be.visible');
            cy.get(':nth-child(5) > .ant-row > .ant-form-item-label').contains(/Número de documento|Document Number/).should('be.visible');
            cy.get('#documentNumber').should('be.visible');
            cy.get(':nth-child(6) > .ant-row > .ant-form-item-label').contains(/Correo electrónico|Email/).should('be.visible');
            cy.get('#email').should('be.visible');
            cy.get(':nth-child(7) > .ant-row > .ant-form-item-label').contains(/Rol|Role/).should('be.visible');
            cy.get(':nth-child(7) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').should('be.visible');
            cy.get(':nth-child(8) > .ant-row > .ant-form-item-label').contains(/Estado|State/).should('be.visible');
            cy.get(':nth-child(8) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').should('be.visible');
            cy.get(':nth-child(9) > .ant-row > .ant-form-item-label').contains(/Seleccione Una Entidad|Seleccione Una Entidad/).should('be.visible');
            cy.get(':nth-child(9) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector').should('be.visible');
            cy.get('.ant-form > .flex').contains(/Crear|Create/).should('be.visible')
            cy.get('.relative > .top-4').click();
            cy.get('.relative > .block').click();
        })
    });

    it('Crear usuario campos vacios', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > .ant-btn').should('be.visible').click();
            cy.get('.ant-form > .flex').click()
            cy.get('#username_help > .ant-form-item-explain-error').contains(/El nombre de usuario es obligatorio|Username is required/).should('be.visible')
            cy.get('#firstNames_help > .ant-form-item-explain-error').contains(/Por favor ingrese los nombres|Please enter the first names/).should('be.visible')
            cy.get('#lastNames_help > .ant-form-item-explain-error').contains(/Por favor ingrese los apellidos|Please enter the last names/).should('be.visible')
            cy.get('#documentNumber_help > .ant-form-item-explain-error').contains(/Por favor ingrese el número de documento|Please enter the document number/).should('be.visible')
            cy.get('#email_help > .ant-form-item-explain-error').contains(/Por favor ingrese un correo electrónico|Please enter an email/).should('be.visible')
            cy.get('#role_help > .ant-form-item-explain-error').contains(/Por favor seleccione un rol|Please select a role/).should('be.visible')
            cy.get('#state_help > .ant-form-item-explain-error').contains(/Por favor seleccione un estado|Please select a state/).should('be.visible')
            cy.get('#entityId_help > .ant-form-item-explain-error').contains(/Entidad necesaria|Entidad necesaria/).should('be.visible')
            cy.get('.relative > .top-4').click();
            cy.get('.relative > .block').click();
        })
    });

    it('Campos con un caracter', () => {
        Cypress._.times(2, () => {
            cy.get('.flex-col > .ant-btn').should('be.visible').click();
            cy.get('#username').type('a').should('be.visible');
            cy.get('#firstNames').type('a').should('be.visible');
            cy.get('#lastNames').type('a').should('be.visible');
            cy.get('#documentNumber').type('a').should('be.visible');
            cy.get('#email').type('a').should('be.visible');
            cy.get('.ant-form > .flex').click()
            cy.get('#username_help > .ant-form-item-explain-error').contains(/El nombre de usuario debe tener al menos 5 caracteres|Username must be at least 5 characters/).should('be.visible')
            cy.get('#email_help > .ant-form-item-explain-error').contains(/Por favor ingrese un correo electrónico válido|Please enter a valid email/).should('be.visible')
            cy.get('.relative > .top-4').click();
            cy.get('.relative > .block').click();
        })
    });

})