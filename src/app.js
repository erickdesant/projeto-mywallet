import express  from 'express'
import Joi from 'joi'
import mongodb from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const URL =  process.env.DATABASE_URL
import {MongoClient, ObjectId} from "mongodb";
import bcrypt from 'bcrypt'

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
    const {name,email,password} = req.body
    const passwordHash = bcrypt.hashSync(password,10)
    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    })
    const validacao = userSchema.validate({name,email,password},{abortEarly: false})
    if(validacao.error){
        const mensagens = validacao.error.details.map(detail => detail.message)
        return res.status(422).send(mensagens)
    }
    try{
        const user = await db.collection("users").findOne({ email })
        if (user) return res.status(409).send("E-mail já cadastrado")
        await db.collection("users").insertOne({name,email,passwordHash})
        res.status(201).send("Usuário registrado")
    }
    catch(error){
        return res.status(500).send(error.message)
    }

})

app.post("/sign-in", async (req, res) => {
    let {email,password} = req.body
    const loginSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    })
    const validacao = loginSchema.validate({email,password},{abortEarly: false})

    if(validacao.error){
        const mensagens = validacao.error.details.map(detail => detail.message)
        return res.status(422).send(mensagens)
    }
    try{
        const result = await db.collection("users").findOne({
            email: email,
        })
        console.log(email,password,result)
        if (result && bcrypt.compareSync(password,result.passwordHash)) {
            console.log(password,result)
            res.status(201).send(`Logado ${email}`)
        }else{
            res.status(401).send("Credenciais não encontradas")
        }
    }
    catch(error){
        console.log(error.message)
        res.status(404).send("Erro ao fazer login")
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