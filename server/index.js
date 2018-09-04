// node后端服务器
const userApi = require('./api/userApi');
const articleApi = require('./api/articleApi');
const iconApi = require('./api/iconApi');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 后端api路由
app.use('/api/user', userApi);
app.use('/api/article', articleApi);
app.use('/api/icon', iconApi);

// 监听端口
var server = app.listen(3000);
console.log('success listen at port:3000......');
server.setTimeout(0)
