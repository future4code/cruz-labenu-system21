import { Request, Response, Router } from 'express'
import {
  createStudent,
  validateHobbies,
  validateStudent,
} from '../controllers/student'
import { Student } from '../types/estudante'

const route = Router()

route.post('/', async (req: Request, res: Response) => {
  try {
    res.statusCode = 400

    const newStudent: Student = validateStudent(req.body)

    const hobbies: Array<string> = validateHobbies(req.body.hobbies)

    await createStudent(newStudent, hobbies)

    res.send(newStudent)
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
