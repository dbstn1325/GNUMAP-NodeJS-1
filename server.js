// 서버 오픈
const { render } = require('ejs');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Router 설정
const find = require('./routes/find.js')
app.use('/find', find)

app.listen(3000, ()=>{
    console.log('listenling 3000')
})

// view 경로 설정
app.set('views', __dirname + '/views');

// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=>{
    return res.render('main.html', {title : 'hi'})
});

