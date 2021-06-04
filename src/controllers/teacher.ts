import { v4 as uuidv4 } from 'uuid'
import { connection } from '../connection'
import { Teacher, TeacherBodyReq } from '../types/docente'
import { Specialty, TeacherSpecialty } from '../types/turma'
import { validDate, validEmail } from '../utils/api_helper'

export function validateTeacher({
  nome,
  email,
  data_nasc,
}: TeacherBodyReq): Teacher {
  if (!nome) {
    throw new Error('Por favor coloque um nome válido')
  } else if (!validEmail(email)) {
    throw new Error('Por favor coloque um email válido')
  } else if (!validDate(data_nasc)) {
    throw new Error('Por favor coloque uma data de nascimento vaĺida')
  }

  return {
    id: uuidv4(),
    nome,
    email,
    data_nasc,
  }
}

export async function validateSpecialties(
  specialties: Array<string>
): Promise<Array<Specialty>> {
  const dbSpecialties = await connection('LabenuSystemSpecialty')

  const dbNames = dbSpecialties.map((item) => item.nome)

  if (!Array.isArray(specialties)) {
    throw new Error(
      'O valor de especialidades precisa ser um array com suas especialidades'
    )
  } else if (specialties.length <= 0) {
    throw new Error('Você precisa ter pelo menos uma especialidade')
  }

  for (let item of specialties) {
    if (!dbNames.includes(item)) {
      throw new Error(
        `A especialidade ${item} não está na lista de especialidades, as especialidades só podem ser [${dbNames}]`
      )
    }
  }

  return dbSpecialties.filter((item) => specialties.includes(item.nome))
}

export async function createTeacher(newTeacher: Teacher): Promise<any> {
  return await connection('LabenuSystemTeacher').insert(newTeacher)
}

export async function addSpecialtiesToTeacher(
  specialties: Array<Specialty>,
  teacher: Teacher
): Promise<any> {
  const teacherSpecialty: Array<TeacherSpecialty> = specialties.map(
    (specialty) => {
      return { teacher_id: teacher.id, specialty_id: specialty.id }
    }
  )
  await connection('LabenuSystemTeacher_Specialty').insert(teacherSpecialty)
}

export async function deleteStudent(teacherId: string) {
  const rows = await connection('LabenuSystemTeacher')
    .delete()
    .where('id', teacherId)

  return rows
}

export async function getTeachers(): Promise<any> {
  return await connection('LabenuSystemTeacher')
}
