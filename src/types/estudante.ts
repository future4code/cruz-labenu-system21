export type Student = {
  id: string
  nome: string
  email: string
  data_nasc: string
}

export type StudentBodyReq = {
  nome: string
  email: string
  data_nasc: string
  hobbies: Array<string>
}

export type Hobby = {
  id: string
  nome: string
}
