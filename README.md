# Playground
- Private playground backend apis
- Framework: Koa
- NodeJS v12.13.1

# Build
```shell script
$ yarn build

$ cp ./dist/index.js [dest]
$ cp -R ./sequelize [dest]
$ cp .sequelizerc [dest]
$ cp package.json [dest]
$ cp yarn.lock [dest]

$ cd [dest]
$ yarn --prod
$ yarn db:sync

START APPLICATION ex) pm2 --no-daemon start index.js
```
