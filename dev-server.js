const express = require('express');
const proxyMiddleWare = require("http-proxy-middleware");
const proxyPath = "http://10.200.172.137:8080";//目标后端服务地址
const proxyOption ={target:proxyPath,changeOrigoin:false}
const app = express();
app.use(express.static("./trunk"))//这段程序的作用是将我们的前端项目设置成静态资源这样我们在浏览器中就可以直接通过http://127.0.0.1:xxxx/xxx(所在页面的目录层级)访问我们的页面,做到边开发边调试.

//这里要注意"/login" 是匹配的路由,它会将匹配的路由进行转发，没匹配到的就不会转发。
app.use("/api",proxyMiddleWare(proxyOption))
app.listen(3011);
console.log('http://localhost:3011')
