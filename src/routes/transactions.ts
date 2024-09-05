import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { knex } from "../database"
import { randomUUID } from "crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"


export async function transactionsRoutes(app: FastifyInstance) {

    //LISTAR TODAS AS TRANSAÇÕES
    app.get('/', {
        preHandler: [checkSessionIdExists]
    }, async (req) => {

        const { sessionId } = req.cookies

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select()

        return {
            transactions
        }
    })

    //lISTAR UMA ÚNICA TRANSAÇÃO PELO ID
    app.get('/:id', {
        preHandler: [checkSessionIdExists]
    }, async (req) => {
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { sessionId } = req.cookies

        const { id } = getTransactionsParamsSchema.parse(req.params)

        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id,
            }).first()

        return {
            transaction
        }
    })

    //PEGAR O SALDO DE TODAS AS TRANSAÇÕES
    app.get('/summary', {
        preHandler: [checkSessionIdExists]
    }, async (req) => {

        const { sessionId } = req.cookies

        const summary = await knex('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'total' })
            .first()

        return {
            summary
        }
    })

    //CRIAR UMA NOVA TRANSAÇÃO
    app.post('/', async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })

        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId,

        })

        return res.status(201).send()


    })
}