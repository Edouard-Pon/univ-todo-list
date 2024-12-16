if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const userRouter = require('./routes/user')

app.use('/user', userRouter)

app.listen(process.env.PORT || 3000)
