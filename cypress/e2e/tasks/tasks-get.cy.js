describe('GET /tasks', () => {




    beforeEach(function () {
        cy.fixture('tasks/tasks-get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('get my tasks', function () {

        const { user, tasks } = this.tasks.list  //pega os valores da lista e armazena nas constantes

        cy.task('deleteTasksLike', 'Estud4r') // Cria uma rotina que deleta todas as taks que possuam a palavra Estud4r

        cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
        cy.postUser(user) //vai recriar a massa do zero toda vez que executarmos garantindo assertividade dos dados e o controle do teste

        cy.postSession(user)  //Vai fazer o post da sessão
            .then(respUser => {  //tendo o callback da response do usuário

            //    cy.postTask(tasks[0], respUser.body.token) //cadastrando as tarefas no usuário correto através do token,
            //    cy.postTask(tasks[1], respUser.body.token)//sem o token não cadastra a tarefa
            //    cy.postTask(tasks[2], respUser.body.token)//começa sempre pela posição zero um array

            //Para não ter que utilizar a estratégia acima que não é uma boa prática, o ideal é utilizar um looping (repetição)
            //para criar as tarefas:

            tasks.forEach(function(t){  //forEach é uma função nativa do javascript e na função passamos t como unidade de registro
                cy.postTask(t, respUser.body.token) //t vai ser abreviação de task no singular e vai percorrer todo o array
            })

            cy.getTasks(respUser.body.token)
                .then(response => {
                expect(response.status).to.eq(200) //validando o status code retornado
            }).its('body')//esta função serve para obter uma propriedade, neste caso vai obter a propriedade body desta propria execução
            .should('be.an', 'array') //garantindo que o retorno do corpo dessa requisição deverá ser um array
            .and('have.length', tasks.length)// e que irá contar a quantidade de itens que terá neste array e verificar se é a mesma 
            //quantidade da nossa massa de testes.


            //Se não houvesse o custom command getTasks, a estratégia seria igual essa abaixo cravado no código:

            /*cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body
                url: '/tasks',
                method: 'GET',
                headers: {
                    authorization: respUser.body.token
                },
                failOnStatusCode: false
            }).then(response => {  //callback da response da api
                expect(response.status).to.eq(200) //validando o status code retornado
            }).its('body')//esta função serve para obter uma propriedade, neste caso vai obter a propriedade body desta propria execução
                .should('be.an', 'array') //garantindo que o retorno do corpo dessa requisição deverá ser um array
                .and('have.length', tasks.length) //e que irá contar a quantidade de itens que terá neste array e verificar se é a mesma 
                //quantidade da nossa massa de testes.

                */
            })


    })
})

describe('GET /tasks/:id', () => {

    beforeEach(function () {
        cy.fixture('tasks/tasks-get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('get unique task', function () {

        const { user, task } = this.tasks.unique

        cy.task('deleteTask', task.name, user.email) //Remove a tarefa referente a execução do cenário anterior, se não tiver, passa direto
        cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
        cy.postUser(user) //vai cadastrar o usuário novamente

        cy.postSession(user)  //Vai fazer o post da sessão fazendo login
            .then(respUser => {  //tendo o callback da response do usuário vai armazenar em userResp
                cy.postTask(task, respUser.body.token) //Registra a tarefa pela massa de dados no argumento
                    .then(respTask => {  //callback que vai armazenar o id em taskResp ao fazer a requisição na API
                                cy.getUniqueTask(respTask.body._id, respUser.body.token)
                                    .then(response => {
                                        expect(response.status).to.eq(200)
                                    })
                })
            })

                        /*cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body de forma encadeada para obter o id da task
                            url: '/tasks/' + taskResp.body._id,  //rota concatenada com o id da task obtido no body e armazenado no callback
                            method: 'GET',
                            headers: {
                                authorization: userResp.body.token
                            },
                            failOnStatusCode: false
                        }).then(response => {  //callback da response da api
                            expect(response.status).to.eq(200) //validando o status code retornado pela response do callback
                            })
                        */
    

    })

    it('task not found', function () {

        const { user, task } = this.tasks.not_found

        cy.task('deleteTask', task.name, user.email) //Remove a tarefa referente a execução do cenário anterior, se não tiver, passa direto
        cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
        cy.postUser(user) //vai cadastrar o usuário novamente

        cy.postSession(user)  //Vai fazer o post da sessão fazendo login
            .then(respUser => {  //tendo o callback da response do usuário vai armazenar em userResp

                cy.postTask(task, respUser.body.token) //Registra a tarefa pela massa de dados no argumento
                    .then(respTask => {  //callback que vai armazenar o id em taskResp ao fazer a requisição na API
                       
                       cy.removeTask(respTask.body._id, respUser.body.token)
                        .then(response => {
                            expect(response.status).to.eq(204)
                        })

                        cy.getUniqueTask(respTask.body._id, respUser.body.token)
                            .then( response => {
                                expect(response.status).to.eq(404)
                            })
                       
                       
                        /*
                        cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body de forma encadeada para obter o id da task
                            url: '/tasks/' + taskResp.body._id,  //rota concatenada com o id da task obtido no body e armazenado no callback
                            method: 'DELETE',
                            headers: {
                                authorization: userResp.body.token
                            },
                            failOnStatusCode: false
                        }).then(response => {  //callback da response da api
                            expect(response.status).to.eq(204) //validando o status code retornado pela response do callback
                            })

                        cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body de forma encadeada para obter o id da task
                            url: '/tasks/' + taskResp.body._id,  //rota concatenada com o id da task obtido no body e armazenado no callback
                            method: 'GET',
                            headers: {
                                authorization: userResp.body.token
                            },
                            failOnStatusCode: false
                        }).then(response => {  //callback da response da api
                            expect(response.status).to.eq(404) //validando o status code retornado pela response do callback
                            })
                            */
                    })

        })
    })
})