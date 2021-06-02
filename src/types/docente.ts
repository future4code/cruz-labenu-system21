enum Especialidades {
  react = "REACT" ,
  redux = "REDUX",
   css = "CSS",
   testes = "TESTES",
   typescript = "TYPESCRIPT",
   programacao_orientada_a_objetos = "PROGRAMACAO_ORIENTADA",
   backend = 'BACKEND'
}

export type docente = {
   nome: string,
   email: string,
   data_nasc: Date,
   turma_id: string,
   espec:Especialidades
}
