describe('Mission', () => {
	it('should display the mission page', () => {
		cy.visit('/missions')
		cy.get('h1').should('not.contain', 'My Courses')
		cy.get('a[href="/missions"]').should('have.css', 'text-decoration', 'underline 4px solid rgb(0, 0, 0)')
		cy.get('a[href="/cart"]').should('be.visible')
		cy.get('nav > ul > div > button.bg-ncrma-400').should('have.text', 'Sign in')
	})
	it('should display enrolled courses if logged in', () => {
		cy.login('daniel_papp@outlook.com')
		cy.visit('/missions')
		cy.get('h1').should('contain', 'My Courses')
		cy.get('a[href="/missions"]').should('have.css', 'text-decoration', 'underline 4px solid rgb(0, 0, 0)')
		cy.get('a[href="/cart"]').should('be.visible')
		cy.get('nav > ul > div > button > span').should(($value) => expect($value.text()).to.eq('dániel bence'))
	})
	it('should render the same course cards', () => {
		cy.visit('/missions')
		//for each course card, check the enrollment number and instructors are shown
		cy.get('div.inline-block.px-3').each((elm, idx) => {
			const card = cy.get(elm)
			card.get('div.flex.my-4').should('be.visible').should('contain.text', 'Enrolled:')
			card.get('ul').should('be.visible').children().should('have.length.at.least', 1)
		})
	})
	// it('should navigate to course page on each card click', () => {
	// 	cy.visit('/missions')
	// 	//for each course card, check the enrollment number and instructors are shown
	// 	cy.get('div.inline-block.px-3').each((elm, idx) => {
	// 		const card = cy.get(elm)
	// 		card.click().then(() => {
	// 			cy.get('h1.text-4xl').should('be.visible')
	// 			cy.get('button.uppercase').should('have.length.at.least', '2')
	// 		})
	// 	})
	// })
})
