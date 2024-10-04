import Joi from 'joi';
export default function validateReq(req, res,next) {
    const validationResult = schema.validate(req.body);
    if(validationResult.error) {
        return res.status(400).send(validationResult.error);
    }
    next()
}