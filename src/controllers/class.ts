import { v4 as uuidv4 } from 'uuid'
import { connection } from '../connection'
import { Class, ClassBodyReq } from '../types/turma'
import { dateBiggerThan, validDate, validModule } from '../utils/api_helper'

export function validateClass({
  nome,
  data_inicio,
  data_final,
  modulo,
}: ClassBodyReq): Class {
  if (!nome) {
    throw new Error('Por favor preencha um nome válido')
  } else if (!validDate(data_inicio) || !validDate(data_final)) {
    throw new Error(
      'Por favor coloque datas de inicio e término válidas e.g data_inicio: 2021/07/15'
    )
  } else if (dateBiggerThan(data_inicio, data_final)) {
    throw new Error('A data de inicio não pode ser maior que a data de término')
  } else if (!validModule(modulo)) {
    throw new Error(
      'Por favor coloque um numero entre entre 1 e 7 pra dizer o modulo atual ou 0 se as aulas não começaram'
    )
  }

  return {
    id: uuidv4(),
    nome,
    data_inicio,
    data_final,
    modulo,
  }
}

export async function createClass(newClass: Class) {
  await connection('LabenuSystemClass').insert(newClass)
}

export async function removeStudentFromClass(
  classId: string,
  studentId: string
): Promise<any> {
  await connection('LabenuSystemStudent')
    .update({
      turma_id: null,
    })
    .where('id', studentId)
    .andWhere('turma_id', classId)
}

export async function removeTeacherFromClass(
  classId: string,
  teacherId: string
): Promise<any> {
  await connection('LabenuSystemTeacher')
    .update({
      turma_id: null,
    })
    .where('id', teacherId)
    .andWhere('turma_id', classId)
}

export async function changeClassModule(
  module: number,
  classId: string
): Promise<any> {
  await connection('LabenuSystemClass').where('id', classId).update({
    modulo: module,
  })
}

export async function getClasses(): Promise<any> {
  return await connection('LabenuSystemClass')
}
