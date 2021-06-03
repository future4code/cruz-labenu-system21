import { Request, Response, Router } from 'express'
import { createClass, validateClass } from '../controllers/class'
import { Class } from '../types/turma'

const route = Router()

route.post('/', async (req: Request, res: Response) => {
  try {
    res.statusCode = 400

    const newClass: Class = validateClass(req.body)

    await createClass(newClass)

    res.status(200).send(newClass)
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
