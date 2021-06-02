import express, { Express, Request, Response } from "express"
import cors from "cors"
import {connection} from './connection'
import { AddressInfo } from "net"


const app: Express = express()
app.use(express.json())
app.use(cors())


const criarDocente = async (id:string, nome:string, email:string, data_nasc:string, turma_id:string)
  : Promise<any> => {
  const [result] = await connection("LabenuSystemTeacher")
       .insert({
         id,
         nome,
         email,
         data_nasc,
         turma_id
       })
       return result
   };


   app.put("/createTeacher", async (req: Request, res: Response) => {
     try {
      
    if (!req.body.nome){
        throw new Error("error, name required")
    }else if(!req.body.email){
        throw new Error("error, email required")
    }else if(!req.body.data_nasc){
        throw new Error("error, date required")
    }else if(!req.body.turma_id){
        throw new Error("error, id_turma required")
    }else if(!req.body.id){
      throw new Error("error, id required")
  }
       
       console.log(await criarDocente(
         req.body.id,
         req.body.nome,
         req.body.email,
        req.body.data_nasc,
        req.body.turma_id,
       )) 
       res.status(200).send("Teacher created!");
     } catch (err) {
       res.status(400).send({
         message: err.message,
       });
     }
   })



   export const getEstudanteById = async (id: string): Promise<any> => {
    const result = await connection.raw(`
      SELECT nome FROM LabenuSystemStudent WHERE id = '${id}'
    `)

     return result[0][0]
  }

   app.get("/estudante/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id

      console.log(await getEstudanteById(id))
     
      res.end()

    } catch (error) {
        console.log(error.message)
      res.status(500).send("Unexpected error")
    }
 })















   const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
       const address = server.address() as AddressInfo;
       console.log(`Server is running in http://localhost:${address.port}`);
    } else {
       console.error(`Failure upon starting server.`);
    }
 })