# Playground
- Private playground backend apis
- Framework: Koa
- NodeJS v12.13.1

# Build
```shell script
$ yarn build

$ cp ./dist/index.js [dest/src/]
$ cp -R ./src/db [dest/src/]
$ cp .sequelizerc [dest]
$ cp package.json [dest]
$ cp yarn.lock [dest]

$ cd [dest]
$ yarn --production
$ sequelize db:migrate
$ sequelize db:seed:all

START APPLICATION ex) pm2 start .src/index.js
```
