import { app } from './app'

process.on('uncaughtException', (err) => {
    console.log(err)
    process.exit(1)
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server Started With Port -> ${PORT}`)
})
