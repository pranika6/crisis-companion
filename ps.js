const http=require('http');
const server=http.createServer((req,res)=>{
    console.log("request made");
    console.log(req.url);
})
server.listen(3000,'localhost',()=>{
    console.log("server is listening");
})