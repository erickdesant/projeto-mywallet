/*
{
    value: float,
        description: string,
    type: string // deposit, withdraw
}*/

import joi from "joi";

const transactionSchema = joi.object({
    value: joi.float().required(),
    description: joi.string().required(),
    type: joi.string().required(),
})