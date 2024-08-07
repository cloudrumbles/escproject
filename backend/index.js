const express = require('express');
const cors = require('cors');
const app = express()
const hotelsRouter = require('./routes/hotels.js');

app.use(cors())
app.use('/api', hotelsRouter);
app.use(express.json())


app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})


const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})