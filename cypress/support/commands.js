// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('postUser', (user) => {
    cy.api({
        url: '/users',
        method: 'POST',
        body: user,
        failOnStatusCode: false
      }).then(response => { return response })
})

Cypress.Commands.add('postSession', (user) => {
  cy.api({
      url: '/sessions',
      method: 'Post',
      body: { email: user.email, password: user.password },  //body mandando apenas as informações que são relevantes para o teste, no caso email e senha.
      failOnStatusCode: false  //Para poder reconhecer resultados de erro
  }).then(response => { return response })  //pega o response no callback e faz o return desse response
})

Cypress.Commands.add('postTask', (task, token) => {
  cy.api({  //testa pela api utilizando as informações abaixo
    url: '/tasks',  //rota acessada
    method: 'POST', //metodo aplicado
    body: task,  //passa o payload  adquirido atraves da constante
    headers: {  //cabeçalho
        authorization: token  //autorização pelo token
    },
    failOnStatusCode: false  //para testar outros status diferentes de 200 (sucesso)
  }).then(response => { return response })
})

Cypress.Commands.add('getTasks', (token) => {
  cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body
      url: '/tasks',
      method: 'GET',
      headers: {
          authorization: token
      },
      failOnStatusCode: false
  }).then(response => { return response }) //retorno da response da api
})

Cypress.Commands.add('getUniqueTask', (taskId, token) => {
  cy.api({  //Vai implementar a requisição, no caso GET, sem o campo body de forma encadeada para obter o id da task
      url: '/tasks/' + taskId,  //rota concatenada com o id da task obtido no body e armazenado no callback
      method: 'GET',
      headers: {
          authorization: token
      },
      failOnStatusCode: false
  }).then(response => { return response })  //retorno da response da api
})

  Cypress.Commands.add('removeTask', (taskId, token) => {
      cy.api({  //Vai implementar a requisição, no caso DELETE, sem o campo body de forma encadeada para deletar a task pelo ID
          url: '/tasks/' + taskId,  //rota concatenada com o id da task obtido no body e armazenado no callback
          method: 'DELETE',
          headers: {
              authorization: token
          },
          failOnStatusCode: false
      }).then(response => { return response })  //retorno da response da api
})

Cypress.Commands.add('putTaskDone', (taskId, token) => {
  cy.api({  //Vai implementar a requisição, no caso PUT, sem o campo body de forma encadeada para obter o id da task
      url: `/tasks/${taskId}/done`, //interpolação da rota com o id da task + a subrota done. Recomendado assim quando houver mais de um valor
      method: 'PUT',
      headers: {
          authorization: token
      },
      failOnStatusCode: false
  }).then(response => { return response })  //retorno da response da api
})