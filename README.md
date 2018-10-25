开发说明

1. gulpfile.js 文件中配置了开发环境和生产编译环境。通过修改isProduction改变环境。

   开发联调：isProduction设置为false.

   生产编译：isProduction设置为true.

   在运行default任务，会在不同的环境下去执行不同的任务列表。

