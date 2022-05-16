const app = require('./server')

const PORT = 3000;


//서버 실행: npm run start
app.listen(PORT, ()=>{
    console.log(`listenling ${PORT}`)
})