describe('POST /tasks', () => {
    

    beforeEach(function () {  //Gancho
        cy.fixture('tasks/tasks-post').then(function (tasks) {  //função fixture que recebe o arquivo tasks e no callback then pega o objeto na qual
                                                    //vai estar carregado o conteudo do arquivo
            this.tasks = tasks      //aí criar a variavel de contexto this que tbm vai chamar tasks para receber o argumento que vai receber
                            //o conteudo arquivo. E assim a váriavel de contexto tasks vai poder ser acessada pelos its deste describe.
        })

    })

    it('register a new task', function () {  //caso de teste com função convencional
            
        const { user, task } = this.tasks.create  ////O javascript pega os dois objetos criados em fixtures create e armazena dentro
        //de cada constante.
            cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
            cy.postUser(user) //vai recriar a massa do zero toda vez que executarmos garantindo assertividade dos dados e o controle do teste
            cy.postSession(user)
                .then(userResp => {
                    cy.log(userResp.body.token) //obtem o token e mostra na tela do teste

                    cy.task('deleteTask', task.name, user.email)  //chama a tarefa criada no cypress.config e deleta a task pelo 
                //nome contido na massa de teste e pelo usuário linkado ao email e o id deste usuário.

                cy.postTask(task, userResp.body.token)  //chama o commands de postTask que vai trazer a task e o token da response do body
                    .then(response => {  //callback then com uma função de seta
                        expect(response.status).to.eq(201)     //que vai validar o status code
                        expect(response.body.name).to.eq(task.name)
                        expect(response.body.tags).to.eql(task.tags) //eql vai se preocupar com os dados e não com a tipagem deles
                        //ou seja, não importa a ordem que eles estejam no array de retorno.
                        expect(response.body.is_done).to.be.false //garante que o campo boleano do is done vem com valor falso
                        expect(response.body.user).to.eql(userResp.body.user._id) //validação de usuário
                        expect(response.body._id.length).to.eq(24)
                    })


                    //abaixo o teste poderia ter ficado direto no código, porém criamos um commands dele, se ficasse direto no código
                    //ficaria assim:

            /*cy.api({  //testa pela api utilizando as informações abaixo
                url: '/tasks',  //rota acessada
                method: 'POST', //metodo aplicado
                body: task,  //passa o payload  adquirido atraves da constante
                headers: {  //cabeçalho
                    authorization: response.body.token  //autorização pelo token
                },
                failOnStatusCode: false  //para testar outros status diferentes de 200 (sucesso)
            }).then(response => {  //callback then com uma função de seta
                expect(response.status).to.eq(200)     //que vai validar o status code*/        
 
            })
    })

    //teria uma outra abordagem de fazer, porém precisaria de dois its, um it para fazer login via api e gerar o token
    //e armazenar ele na variavel de ambiente do cypress: Cypress.env('token', response.body.token) e dentro
    //de authorization enviaria esse token para a api Cypress.env('token').
    //Porém não é uma boa prática trabalhar com vários its para resolver um único problema pois tornaria o teste com dependencia.
    //Então vamos optar por essa abordagem do teste acima colocando a chamada da api cy.api dentro do callback then para
    //conseguir atribuir a autorização ao cabeçalho headers.


    it('duplicate task', function () {

        const { user, task } = this.tasks.dup  ////O javascript pega os dois objetos criados em fixtures create e armazena dentro
        //de cada constante.
            cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
            cy.postUser(user) //vai recriar a massa do zero toda vez que executarmos garantindo assertividade dos dados e o controle do teste
            cy.postSession(user)
                .then(userResp => {
                    cy.log(userResp.body.token) //obtem o token e mostra na tela do teste

                    cy.task('deleteTask', task.name, user.email)  //chama a tarefa criada no cypress.config e deleta a task pelo 
                //nome contido na massa de teste e pelo usuário linkado ao email e o id deste usuário.
                cy.postTask(task, userResp.body.token)
                cy.postTask(task, userResp.body.token)  //chama o commands de postTask que vai trazer a task e o token da response do body
                    .then(response => {  //callback then com uma função de seta
                        expect(response.status).to.eq(409)     //que vai validar o status code
                        expect(response.body.message).to.eq('Duplicated task!')

                 })
            })
    })

})