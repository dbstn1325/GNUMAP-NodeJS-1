const app = require("./server.js");

const PORT = 8000;

//서버 실행: npm run start
app.listen(PORT, () => {
  console.log(`listenling ${PORT}`);
});
