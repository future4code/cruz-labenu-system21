export type Student = {
  id: string
  nome: string
  email: string
  data_nasc: string
}

export type StudentBodyReq = {
  nome: string
  email: string
  dataNasc: string
  hobbies: Array<string>
  turmaId: string
}
