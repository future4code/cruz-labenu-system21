import { v4 as uuidv4 } from 'uuid'
import { connection } from '../connection'
import { Hobby, Student, StudentBodyReq } from '../types/estudante'
import { calculateAge, validDate, validEmail } from '../utils/api_helper'

export function validateStudent({
  nome,
  email,
  data_nasc,
}: StudentBodyReq): Student {
  if (!nome) {
    throw new Error('Por favor coloque um nome válido')
  } else if (!validEmail(email)) {
    throw new Error('Por favor coloque um email válido')
  } else if (!validDate(data_nasc)) {
    throw new Error(
      'Coloque um data válida em data de nascimento e.g data_nasc: 2000/05/15'
    )
  }

  return {
    id: uuidv4(),
    nome,
    email,
    data_nasc,
  }
}

export function validateHobbies(hobbies: Array<string>): Array<string> {
  if (!Array.isArray(hobbies)) {
    throw new Error('O valor de hobbies precisa ser um array com seus hobbies')
  } else if (hobbies.length <= 0) {
    throw new Error('Você precisa ter pelo menos um hobbie')
  }

  return hobbies
}

export async function createStudent(
  student: Student,
  hobbies: Array<string>
): Promise<void> {
  const mappedHobbies = hobbies.map((hobby) => {
    return { id: uuidv4(), nome: hobby }
  })

  await connection('LabenuSystemStudent')
    .insert(student)
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
        return { student_id: student.id, hobby_id: hobby.id }
      })

      await connection('LabenuSystemStudent_Hobby').insert(studentHobbyRelation)
    })
}

export async function getStudentAge(id: string): Promise<any> {
  const result = await connection('LabenuSystemStudent')
    .where('id', id)
    .select('data_nasc')

  const age = calculateAge(result[0].data_nasc)

  return age
}

export async function getStudentsByHobby(hobby: Hobby) {
  const result = await connection('LabenuSystemStudent as student')
    .join(
      'LabenuSystemStudent_Hobby as student_hobby',
      'student_hobby.student_id',
      '=',
      'student.id'
    )
    .where('student_hobby.hobby_id', hobby.id)
    .select('id', 'nome', 'email', 'data_nasc', 'turma_id', 'hobby_id')

  return result
}

export async function deleteStudent(studentId: string) {
  const rows = await connection('LabenuSystemStudent')
    .delete()
    .where('id', studentId)

  return rows
}

export async function getStudents(): Promise<any> {
  return await connection('LabenuSystemStudent')
}
