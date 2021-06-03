export type Class = {
  id: string
  nome: string
  data_inicio: string
  data_final: string
  modulo: number
}

export type ClassBodyReq = {
  nome: string
  data_inicio: string
  data_final: string
  modulo: number
}

export type Specialty = {
  nome: string
  id: string
}

export type TeacherSpecialty = {
  teacher_id: string
  specialty_id: string
}
