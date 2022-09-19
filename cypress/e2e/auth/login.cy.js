/// <reference types="cypress" />

describe('The login field renders', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/auth/login')
	})
	it('renders the login field', () => {
		cy.get('[name=email]').should('be.visible')
	})
	it('fields have proper a11y attributes', () => {
		cy.get('[name=email]').should('have.attr', 'type', 'email')
		cy.get('[name=email]').should('have.attr', 'placeholder')
		cy.get('[name=email]').should('have.attr', 'required')
		cy.get('button').should('have.attr', 'type', 'submit')
	})
	it('the form will not submit invalid email address', () => {
		cy.get('[name=email]').type('breakingYourSystem')
		cy.get('[type=submit]').click()
		cy.get('input:invalid').should('have.length', 1)
	})
})

describe('The login let users sign in', () => {
	it('user gets prompted for verification code on valid login', () => {
		cy.visit('http://localhost:3000/auth/login')
		cy.get('[name=email]').type('dpapp001@odu.edu')
		cy.get('[type=submit]').click()
		cy.get('[name=token]').should('be.visible')
	})
	it('user gets redirected to missions page on successful login', () => {
		cy.login()
		cy.url().should('include', '/missions')
	})
	it('user gets redirected to error page on unsuccessful login', () => {
		cy.login(undefined, '123456')
		cy.url().should('include', '/api/auth/error')
	})
})
