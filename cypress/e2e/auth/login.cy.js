/// <reference types="cypress" />

import { sign, verify } from 'jsonwebtoken'

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

// describe('The login let users sign in', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3000/auth/login')
//   })
//   it('user gets prompted for verification code on valid login', () => {
//     cy.get('[name=email]').type('dpapp001@odu.edu')
//     cy.get('[type=submit]').click()
//     cy.get('[name=token]').should('be.visible')
//     cy.request({
//       method: 'GET',
//       url: 'http://localhost:3000/api/auth/csrf',
//     }).then((response) => {
//       const csrf = response.body.csrfToken
//       return csrf
//     })
//   })
// })
