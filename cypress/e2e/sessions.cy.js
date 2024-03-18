describe('POST /sessions', () => {

    beforeEach(function() {
        cy.fixture('users').then(function (users) {
            this.users = users
        })
    })

    it('user session', function() {
        const userData = {  //massa de teste
            name: 'Lagertha',
            email: 'lagertha@gmail.com',
            password: 'pwd123'
        }

        cy.task('deleteUser'), userData.email  //Garantir que o usuário será deletado no banco de dados conforme task criada no arquivo 
        //cypress.config
        cy.postUser(userData) //Para depois ser criado novamente conforme o comando criado.

        cy.postSession(userData)  //Invoca o comando criado passando a massa userData
            .then(response => {
                expect(response.status).to.eq(200)  //Valida o status code sempre antes de validar qualquer outro campo

                const { user, token } = response.body  //Este user é o nome do valor/objeto que a api devolve no teste e essa constante 
                //pega o resultado obtido e o token também é um resultado obtido

                expect(user.name).to.eq(userData.name)  //Valida se as informações estão corretas
                expect(user.email).to.eq(userData.email)  //Valida se as informações estão corretas
                expect(token).not.to.be.empty  //Valida se as informações estão corretas. A validação do token deve ser feita no teste unitário. 
                //Neste caso vamos validar apenas que existe um token no resultado.
            })
    })

    it('invalid password', function() {
        const user = {
            email: 'tarik.feitosa@gmail.com',
            password: '123456'
        }
        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
             })
    })

    it('email not found', function() {
        const user = {
            email: 'eleven@gmail.com',
            password: 'pwd123'
        }
        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
             })
    })
})


