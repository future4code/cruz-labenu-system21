import cors from 'cors'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import express, { Express, Request, Response } from 'express'
import { AddressInfo } from 'net'
import { v4 as uuidv4 } from 'uuid'
import { connection } from './connection'
import { Student, StudentBodyReq } from './types/estudante'

dayjs.extend(customParseFormat)

const app: Express = express()
app.use(express.json())
app.use(cors())

const criarDocente = async (
  nome: string,
  email: string,
  data_nasc: string,
  turma_id: string
): Promise<any> => {
  const [result] = await connection('LabenuSystemTeacher').insert({
    id: uuidv4(),
    nome,
    email,
    data_nasc,
    turma_id,
  })
  return result
}

app.put('/createTeacher', async (req: Request, res: Response) => {
  try {
    if (!req.body.nome) {
      throw new Error('error, name required')
    } else if (!req.body.email) {
      throw new Error('error, email required')
    } else if (!req.body.data_nasc) {
      throw new Error('error, date required')
    } else if (!req.body.turma_id) {
      throw new Error('error, id_turma required')
    }

    console.log(
      await criarDocente(
        req.body.nome,
        req.body.email,
        req.body.data_nasc,
        req.body.turma_id
      )
    )
    res.status(200).send('Teacher created!')
  } catch (err) {
    res.status(400).send({
      message: err.message,
    })
  }
})

export const getEstudanteById = async (id: string): Promise<any> => {
  const result = await connection.raw(`
      SELECT nome FROM LabenuSystemStudent WHERE id = '${id}'
    `)

  return result[0][0]
}

app.get('/estudante/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    console.log(await getEstudanteById(id))

    res.end()
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Unexpected error')
  }
})

app.post('/students', async (req: Request, res: Response) => {
  try {
    const { nome, email, dataNasc, hobbies }: StudentBodyReq = req.body
    const parsedDataNasc = dayjs(dataNasc, 'YYYY-MM-DD')

    res.statusCode = 400

    if (!nome) {
      throw new Error('Por favor coloque um nome válido')
    } else if (!email || !email.includes('@')) {
      throw new Error('Por favor coloque um email válido')
    } else if (!parsedDataNasc.isValid()) {
      throw new Error(
        'Coloque um data válida em data de nascimento e.g dataNasc: 2000/05/15'
      )
    } else if (!Array.isArray(hobbies)) {
      throw new Error(
        'O valor de hobbies precisa ser um array com seus hobbies'
      )
    } else if (hobbies.length <= 0) {
      throw new Error('Você precisa ter pelo menos um hobbie')
    }

    const newStudent: Student = {
      id: uuidv4(),
      nome,
      email,
      data_nasc: parsedDataNasc.format('YYYY-MM-DD'),
    }

    const mappedHobbies = hobbies.map((hobby) => {
      return { id: uuidv4(), nome: hobby }
    })

    await connection('LabenuSystemStudent')
      .insert(newStudent)
      .then(async () => {
        await connection('LabenuSystemHobby')
          .insert(mappedHobbies)
          .onConflict('nome')
          .ignore()
      })
      .then(async () => {
        const studentHobbies = await connection('LabenuSystemHobby').whereIn(
          'nome',
          hobbies
        )

        const studentHobbyRelation = studentHobbies.map((hobby) => {
          return { student_id: newStudent.id, hobby_id: hobby.id }
        })

        await connection('LabenuSystemStudent_Hobby').insert(
          studentHobbyRelation
        )
      })

    res.send(newStudent)
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

type ClassBodyReq = {
  nome: string
  dataInicio: string
  dataTermino: string
  modulo: number
}

app.post('/classes', async (req: Request, res: Response) => {
  try {
    const { nome, dataInicio, dataTermino, modulo }: ClassBodyReq = req.body
    const parsedDataInicio = dayjs(dataInicio, 'YYYY/MM/DD')
    const parsedDataTermino = dayjs(dataTermino, 'YYYY/MM/DD')

    res.statusCode = 400

    if (!nome) {
      throw new Error('Por favor preencha um nome válido')
    } else if (!parsedDataInicio.isValid() || !parsedDataTermino.isValid()) {
      throw new Error(
        'Por favor coloque datas de inicio e término válidas e.g dataInicio: 2021/07/15'
      )
    } else if (parsedDataInicio.valueOf() > parsedDataTermino.valueOf()) {
      throw new Error(
        'A data de inicio não pode ser maior que a data de término'
      )
    } else if (isNaN(modulo) || modulo < 0 || modulo > 7) {
      throw new Error(
        'Por favor coloque um numero entre entre 1 e 7 pra dizer o modulo atual ou 0 se as aulas não começaram'
      )
    }

    const newClass = {
      id: uuidv4(),
      nome,
      data_inicio: dataInicio,
      data_final: dataTermino,
      modulo,
    }

    await connection('LabenuSystemClass').insert(newClass)

    res.status(200).send(newClass)
  } catch (error) {
    res.send({ message: error.sqlMessage || error.message })
  }
})

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo
    console.log(`Server is running in http://localhost:${address.port}`)
  } else {
    console.error(`Failure upon starting server.`)
  }
})
