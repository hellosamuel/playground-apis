# Playground

- Private playground backend apis
- Framework: Koa
- NodeJS v12.13.1

# Develop

Please make sure that you set envs for starting server. you can check sample file at .env.sample

```shell script
$ yarn
$ docker compose up -d
$ yarn db:sync
$ yarn start
```

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
