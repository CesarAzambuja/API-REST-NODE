import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  //INSERINDO DADOS
  // const transaction = await knex('transactions').insert({
  //   id: crypto.randomUUID(),
  //   title: 'Transação de teste',
  //   amount: 100.05,
  // }).returning('*')

  //CONSULTANDO TODOS OS DADOS DA TABELA
  // const transactions = await knex('transactions').select('*')

  //CONSULTANDO DADOS COM CONDIÇÕES
  const transactions = await knex('transactions')
    .where('amount', 100.05)
    .select('*')


  return transactions

})






app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
