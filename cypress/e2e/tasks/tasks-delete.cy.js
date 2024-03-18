describe('DELETE /tasks/:id', () => {

    beforeEach(function () {
        cy.fixture('tasks/tasks-delete').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('remove a task', function () {
        const { user, task } = this.tasks.remove

        cy.task('deleteTask', task.name, user.email) //Remove a tarefa referente a execução do cenário anterior, se não tiver, passa direto
        cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
        cy.postUser(user) //vai cadastrar o usuário novamente

        cy.postSession(user)  //Vai fazer o post da sessão fazendo login
            .then(respUser => {  //tendo o callback da response do usuário vai armazenar em userResp
                cy.postTask(task, respUser.body.token) //Registra a tarefa pela massa de dados no argumento
                    .then(respTask => {  //callback que vai armazenar o id em taskResp ao fazer a requisição na API
                        cy.removeTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(204) //sucesso sem conteudo para ser devolvido no corpo da resposta
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

                        cy.removeTask(respTask.body._id, respUser.body.token)
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