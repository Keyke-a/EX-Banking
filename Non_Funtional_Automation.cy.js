describe('Non-Functional EX Bankingz', () => {
  // Run this function before each test case
  beforeEach(() => {
    cy.visit('https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/'); // Visit the URL 'https://exbanking-api.com'
  });

  // Test Case 1: Ensure account balance request returns a successful result in less than 500 milliseconds
  it('Should ensure account balance request returns a successful result in less than 500 milliseconds', () => {
    cy.intercept('GET', '/api/account_balance').as('getBalance'); // Intercept the GET request to '/api/account_balance' and assign it an alias 'getBalance'
    cy.visit('https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/'); // Visit the URL 'https://exbanking-api.com/balance' to trigger the account balance request
    cy.wait('@getBalance').its('duration').should('be.lessThan', 500); // Wait for the 'getBalance' interception, access the duration property of the response, and assert that it is less than 500 milliseconds
  });

  // Test Case 2 Ensure withdrawal amounts within a specified range are successful
  describe('API Error Responses', () => {
    it('should return an error for negative amount', () => {
      cy.request({
        method: 'POST',
        url: '/api/endpoint',
        body: {
          amount: -10
        },
        failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx status codes
      }).then(response => {
        expect(response.status).to.eq(400); // Assert that the response has a 400 Bad Request status code
        expect(response.body.error).to.eq('Invalid amount'); // Assert the error message or code returned by the API
      });
    });
  
    it('should return an error for zero amount', () => {
      cy.request({
        method: 'POST',
        url: '/api/endpoint',
        body: {
          amount: 0
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Invalid amount');
      });
    });
  
    it('should return an error for non-numeric amount', () => {
      cy.request({
        method: 'POST',
        url: '/api/endpoint',
        body: {
          amount: 'invalid'
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Invalid amount');
      });
    });
  });
  
});
