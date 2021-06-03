import { Request, Response, Router } from 'express'
import {
  addSpecialtiesToTeacher,
  createTeacher,
  deleteStudent,
  validateSpecialties,
  validateTeacher,
} from '../controllers/teacher'

const route = Router()

route.post('/', async (req: Request, res: Response) => {
  try {
    const newTeacher = validateTeacher(req.body)
    const specialties = await validateSpecialties(req.body.especialidades)

    await createTeacher(newTeacher)
    await addSpecialtiesToTeacher(specialties, newTeacher)

    res.status(200).send({ message: 'Teacher created!' })
  } catch (err) {
    res.status(400).send({
      message: err.message,
    })
  }
})

route.delete('/:teacherId', async (req: Request, res: Response) => {
  try {
    const teacherId: string = req.params.teacherId
    res.statusCode = 400

    if (!(await deleteStudent(teacherId))) {
      res.statusCode = 404
      throw new Error('Não foi achado nenhum professor com esse id')
    }

    res.status(204).send({ message: 'Professor deletado com sucesso!' })
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
