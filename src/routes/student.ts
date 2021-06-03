import { Request, Response, Router } from 'express'
import {
  createStudent,
  getStudentAge,
  validateHobbies,
  validateStudent,
} from '../controllers/student'
import { Student } from '../types/estudante'
import { studentExist } from '../utils/api_helper'

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

route.get('/age/:id', async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    res.statusCode = 400

    if (!(await studentExist(id))) {
      res.statusCode = 404
      throw new Error('Não há nenhum estudante com esse id')
    }

    const result = await getStudentAge(id)
    res.status(200).send({ idade: result })
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
