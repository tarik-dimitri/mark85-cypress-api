const { defineConfig } = require("cypress");
const { connect } = require('./cypress/support/mongo')

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      allureWriter(on, config);

      const db = await connect()

      on('task', {
        async deleteUser(email) {  //cria uma tarefa assincrona que vai receber o argumento email e armazenar
          const users = db.collection('users')
          await users.deleteMany({ email: email })
          return null
        },
        async deleteTask(taskName, emailUser) {  //cria uma tarefa assincrona que vai receber o argumento taskName e armazenar
          const users = db.collection('users')  //criar uma constante que vai fazer uma chamada na coleçao do banco que recebe a função users

          const user = users.findOne({ email: emailUser }) //cria a constante de um unico usuário  que vai receber este unico usuário através
          //do email dele, buiscando ele pelo email conseguimos ter o identificador deste usuário, assim melhorando a assertividade na hora
          //de deletar uma tarefa. Para caso algum outro usuário tenha uma tarefa de mesmo nome, não ter ela deletada junto com a deste usuário

          const tasks = db.collection('tasks')  //cria a constante tasks que vai receber a coleção do banco de dados tasks
          await tasks.deleteMany({ name: taskName, user: user._id })  //dentro da coleção deleta a tarefa pelo nome e pelo id do usuário
          return null  //retorna vazio
        },
        async deleteTasksLike(key) {  //cria uma tarefa assincrona que vai receber o argumento da palavra especifica que deletará tarefas

          const tasks = db.collection('tasks')  //cria a constante tasks que vai receber a coleção do banco de dados tasks
          await tasks.deleteMany({ name: { $regex: key } })  //dentro da coleção deleta a tarefa pelo nome e pela expressão regular $regex
          //que receberá a chave key para determinar as tarefas que serão excluidas
          return null  //retorna vazio
        }
      })

      return config
    },
    baseUrl: 'http://localhost:3333',
    env: {
      allure: true
    }
  },
});
