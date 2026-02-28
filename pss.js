const http=require('http');
const server=http.createServer((req,res)=>{
    console.log("request made");
    console.log(req.url);
    console.log(req.method)


    res.setHeader('Content-Type','text/html');
    
res.write('<h1 background-color="blue">welcome to pcs class</h1>\n <h5>hi</h5>');
res.end()
})

server.listen(3000,'localhost',()=>{
    console.log("server is listening");
})