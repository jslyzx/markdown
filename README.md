# test

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## customize comands

# install dependencies
cnpm install

# run website
npm run dev

# run server
nodemon index

# modify marked/lib/marked.js
Line544:
'em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,'
修改为
'em: /^\*([^\s*"<\[])\*(?!\*)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,'

该修改是将 marked 的斜体识别逻辑从“支持星号和下划线”缩减为“仅支持星号”，主要用于防止变量名中的下划线被错误识别

# 启动后台服务
node server/index.js
