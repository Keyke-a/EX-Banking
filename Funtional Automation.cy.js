describe('ExBanking Services Functional Tests', () => {
    let userId;
  
    beforeEach(() => {
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/create_user', {
        name: 'Kiki williams',
        email: 'kiki.w@gmail.com',
        password: 'secretpassword'
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.user_id).to.exist;
        userId = response.body.user_id;
      });
    });
  
    it('should create a new user with valid input data', () => {
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/create_user', {
        name: 'simi Buch',
        email: 'simi.bush@hotmail.com',
        password: 'secretpassword'
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.user_id).to.exist;
      });
    });
  
    it('should throw an error if the email provided already exists', () => {
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/create_user', {
        name: ' Eliora Wood',
        email: 'E.Woods@yahoo.com',
        password: 'secretpassword'
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Email already exists');
      });
    });
  
    it('should deposit a specified amount into the user\'s account successfully', () => {
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/deposit', {
        user_id: userId,
        amount: 100.00
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Deposit successful');
        expect(response.body.new_balance).to.equal(100.00);
      });
    });
  
    it('should only accept numeric and special character (.) in the amount deposited field', () => {
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/deposit', {
        user_id: userId,
        amount: 'abc123'
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Invalid amount');
      });
  
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/deposit', {
        user_id: userId,
        amount: '100.50'
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Deposit successful');
        expect(response.body.new_balance).to.equal(100.50);
      });
    });
  
    it('should make a withdrawal from the user\'s account successfully', () => {
      // Deposit funds before withdrawing
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/withdrawal', {
        user_id: userId,
        amount: 100.00
      }).then(() => {
        cy.request('POST', '/withdraw', {
          user_id: userId,
          amount: 50.00
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal('Withdrawal successful');
          expect(response.body.new_balance).to.equal(50.00);
        });
      });
    });
  
    it('should retrieve the current account balance correctly for the given user', () => {
      // Deposit funds before getting balance
      cy.request('POST', 'https://5648b3b7-6b9e-4a72-ad1a-39d298bebce2.mock.pstmn.io/deposit', {
        user_id: userId,
        amount: 100.00
      }).then(() => {
        cy.request('GET', `/get_balance?user_id=${userId}`).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.user_id).to.equal(userId);
          expect(response.body.balance).to.equal(100.00);
        });
      });
    });
})