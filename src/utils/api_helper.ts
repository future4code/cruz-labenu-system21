import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { connection } from '../connection'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

function dayjsDate(date: string): Dayjs {
  return dayjs(date, 'YYYY/MM/DD')
}

export function validDate(date: string): boolean {
  const dateObj = dayjsDate(date)
  return dateObj.isValid()
}

export function dateBiggerThan(date1: string, date2: string): boolean {
  return dayjsDate(date1).isAfter(dayjsDate(date2))
}

export function validModule(module: number): boolean {
  if (isNaN(module) || module < 0 || module > 7) {
    return false
  }
  return true
}

export function validEmail(email: string) {
  return email && email.includes('@')
}

export function calculateAge(birthDate: string): number {
  const age = dayjs().diff(dayjs(birthDate), 'year')
  return age
}

export async function studentExist(id: string): Promise<any> {
  const result = await connection('LabenuSystemStudent').where('id', id)
  if (!result.length) {
    return false
  }
  return true
}

export async function teacherExist(id: string): Promise<any> {
  const result = await connection('LabenuSystemTeacher').where('id', id)
  if (!result.length) {
    return false
  }
  return true
}

export async function classExist(id: string): Promise<any> {
  const result = await connection('LabenuSystemClass').where('id', id)
  if (!result.length) {
    return false
  }
  return true
}

export async function hobbyExist(hobby: string): Promise<any> {
  const result = await connection('LabenuSystemHobby').where('nome', hobby)
  if (!result.length) {
    return null
  }
  return result[0]
}

export async function isStudentInClass(studentId: string, classId: string) {
  const result = await connection('LabenuSystemStudent')
    .where('id', studentId)
    .andWhere('turma_id', classId)
  if (!result.length) {
    return false
  }
  return true
}

export async function isTeacherInClass(teacherId: string, classId: string) {
  const result = await connection('LabenuSystemTeacher')
    .where('id', teacherId)
    .andWhere('turma_id', classId)
  if (!result.length) {
    return false
  }
  return true
}
