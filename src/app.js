import express  from 'express'
import Joi from 'joi'
import mongodb from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const URL =  process.env.DATABASE_URL
import {MongoClient, ObjectId} from "mongodb";

const mongoClient = new MongoClient(URL)
let db

async function connectDb (){
    try{
        await mongoClient.connect()
        db = mongoClient.db()
        console.log("Connected to DB")
    }
    catch(err){
        console.log(err)
    }
}

connectDb()
app.use(express.json());

app.post("/sign-up", async (req, res) => {
    const user = req.body
    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    })
    const validacao = userSchema.validate(user,{abortEarly: false})
    if(validacao.error){
        const mensagens = validacao.error.details.map(detail => detail.message)
        return res.status(422).send(mensagens)
    }
    try{
        const result = await db.collection("users").insertOne(user)
        res.status(201).send("Usuário registrado")
    }
    catch(error){
        return res.status(500).send(error.message)
    }

})

app.post("/sign-in", async (req, res) => {
    const user = req.body
    const loginSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    })
    const validacao = loginSchema.validate(user,{abortEarly: false})
    if(validacao.error){
        const mensagens = validacao.error.details.map(detail => detail.message)
        return res.status(422).send(mensagens)
    }
    const result = await db.collection("users").findOne(user)
    if (result) {
        res.status(201).send("Logado")
    }
    else{
        res.status(404).send("Usuário não encontrado")
    }
})

app.post("/transactions", async (req,res) => {
    const transaction = req.body
    const result = await db.collection("transactions").insertOne(transaction)
    if(!result){
        res.status(400).send("Erro ao criar transação")
    }
    else{
        res.status(200).send("Transação criada")
    }
})

app.get("/transaction",async (req,res)=>{

})



app.listen(PORT,() => {
    console.log(`Servidor na porta ${PORT}`)
})