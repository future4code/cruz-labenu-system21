import { Request, Response, Router } from 'express'
import {
  addSpecialtiesToTeacher,
  createTeacher,
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

export default route
