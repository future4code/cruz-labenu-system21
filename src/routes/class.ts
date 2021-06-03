import { Request, Response, Router } from 'express'
import { connection } from '../connection'
import { createClass, validateClass } from '../controllers/class'
import { Class } from '../types/turma'
import { classExist, studentExist, teacherExist } from '../utils/api_helper'

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

route.put('/:classId/students', async (req: Request, res: Response) => {
  try {
    const class_id = req.params.classId
    const student_id = req.body.student_id

    if (!(await classExist(class_id))) {
      throw new Error('Não existe nenhuma turma com esse id')
    } else if (!(await studentExist(student_id))) {
      throw new Error('Não existe nenhum estudante com esse id')
    }

    await connection('LabenuSystemStudent')
      .where('id', student_id)
      .update({
        turma_id: class_id,
      })
      .then(console.log)

    res.status(200).send({ message: 'Student added with sucess' })
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

route.put('/:classId/teachers', async (req: Request, res: Response) => {
  try {
    const class_id = req.params.classId
    const teacher_id = req.body.teacher_id

    if (!(await classExist(class_id))) {
      throw new Error('Não existe nenhuma turma com esse id')
    } else if (!(await teacherExist(teacher_id))) {
      throw new Error('Não existe nenhum professor com esse id')
    }

    await connection('LabenuSystemTeacher')
      .where('id', teacher_id)
      .update({
        turma_id: class_id,
      })
      .then(console.log)

    res.status(200).send({ message: 'Teacher added with sucess' })
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

export default route
