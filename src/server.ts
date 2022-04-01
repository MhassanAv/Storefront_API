import express from 'express'
import bodyParser from 'body-parser'

const app: express.Application = express()
const address: string = "http://localhost:3000"

app.use(bodyParser.json())

app.get('/', (__req:express.Request, res: express.Response)=>{
    res.send('Hello World!')
})

app.listen(3000, ()=>{
    console.log(`starting app on: ${address}`)
})

export default app;