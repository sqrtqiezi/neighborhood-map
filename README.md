Udacity前端项目 - 街区地图
================

## 项目目的
* 了解如何使用 MV 方式组织项目
* 了解如何一部获取数据
* 了解 API 服务

## 评审标准
[https://review.udacity.com/#!/rubrics/501/view](https://review.udacity.com/#!/rubrics/501/view)

## 演示地址
[http://qiezi.io/neighborhood-map/](http://qiezi.io/neighborhood-map/)

## 如何运行

1. 项目依赖 [LeanCloud](https://leancloud.cn/) 的数据存储服务，首先需要在 LeanCloud 中创建应用，并将修改 `src/lib/api.js` 中的 APP_ID 和 APP_KEY
2. 运行 `npm install` 安装所有依赖的包
3. 运行 `npm run build ` 编译代码
4. 在浏览器中打开 `dist/dataImport.html` ，完成数据导入
5. 在浏览器中打开 `index.html` 