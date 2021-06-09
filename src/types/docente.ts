enum Especialidades {
  react = 'REACT',
  redux = 'REDUX',
  css = 'CSS',
  testes = 'TESTES',
  typescript = 'TYPESCRIPT',
  programacao_orientada_a_objetos = 'PROGRAMACAO_ORIENTADA',
  backend = 'BACKEND',
}

export type Teacher = {
  id: string
  nome: string
  email: string
  data_nasc: string
}

export type TeacherBodyReq = {
  nome: string
  email: string
  data_nasc: string
}
