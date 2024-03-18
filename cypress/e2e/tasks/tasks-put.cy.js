describe('PUT /tasks/:id/done', () => {

    beforeEach(function () {
        cy.fixture('tasks/tasks-put').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('update task to done', function () {

        const { user, task } = this.tasks.update

        cy.task('deleteTask', task.name, user.email) //Remove a tarefa referente a execução do cenário anterior, se não tiver, passa direto
        cy.task('deleteUser', user.email)  //Vai deletar o usuário sempre para garantir que ele seja recriado do zero
        cy.postUser(user) //vai cadastrar o usuário novamente

        cy.postSession(user)  //Vai fazer o post da sessão fazendo login
            .then(respUser => {  //tendo o callback da response do usuário vai armazenar em userResp
                cy.postTask(task, respUser.body.token) //Registra a tarefa pela massa de dados no argumento
                    .then(respTask => {  //callback que vai armazenar o id em taskResp ao fazer a requisição na API

                        cy.putTaskDone(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(204)
                            })

                        cy.getUniqueTask(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.body.is_done).to.be.true
                            })
                    })
            })
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

                        cy.putTaskDone(respTask.body._id, respUser.body.token)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })

    })
})