import { Request, Response, Router } from 'express'
import {
  createStudent,
  deleteStudent,
  getStudentAge,
  getStudents,
  getStudentsByHobby,
  validateHobbies,
  validateStudent,
} from '../controllers/student'
import { Student } from '../types/estudante'
import { hobbyExist, studentExist } from '../utils/api_helper'

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

route.get('/', async (req: Request, res: Response) => {
  const result = await getStudents()
  res.status(200).send(result)
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

route.get('/search', async (req: Request, res: Response) => {
  try {
    const hobby: string | undefined = req.query.hobby as string | undefined

    if (!hobby) {
      throw new Error('Por favor coloque um nome de hobby válido')
    }

    const hobbyExiste = await hobbyExist(hobby)

    if (!hobbyExiste) {
      throw new Error('Não existe nenhum hobby com esse nome')
    }

    const result = await getStudentsByHobby(hobbyExiste)

    res.status(200).send(result)
  } catch (error) {
    res.status(400).send({ message: error.sqlMessage || error.message })
  }
})

route.delete('/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId: string = req.params.studentId
    res.statusCode = 400

    if (!(await deleteStudent(studentId))) {
      res.statusCode = 404
      throw new Error('Não foi achado nenhum estudante com esse id')
    }

    res.status(204).send({ message: 'Estudante deletado com sucesso!' })
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
