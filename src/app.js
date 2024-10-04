import express  from 'express'

import dotenv from 'dotenv'
import mongodb from 'mongodb'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const URL =  process.env.DATABASE_URL
import {MongoClient, ObjectId} from "mongodb";

const mongoClient = new MongoClient(URL)
let db

try{
    await mongoClient.connect()
    db = mongoClient.db()
    console.log("Connected to DB")
}
catch(err){
    console.log(err)
}

app.post("/sign-up", (req, res) => {
    const user = req.body
    res.send(user)
})

app.listen(PORT,() => {
    console.log(`Servidor na porta ${PORT}`)
})