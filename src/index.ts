import cors from 'cors'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import express, { Express } from 'express'
import { AddressInfo } from 'net'
import classRoute from './routes/class'
import studentRoute from './routes/student'
import teacherRoute from './routes/teacher'

dayjs.extend(customParseFormat)

const app: Express = express()
app.use(express.json())
app.use(cors())

app.use('/teachers', teacherRoute)
app.use('/students', studentRoute)
app.use('/classes', classRoute)

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo
    console.log(`Server is running in http://localhost:${address.port}`)
  } else {
    console.error(`Failure upon starting server.`)
  }
})
