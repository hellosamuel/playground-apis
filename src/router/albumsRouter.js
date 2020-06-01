import Router from '@koa/router'

import AlbumsController from '../controller/albumsController'

const AlbumsRouter = new Router()
const { getAlbums, getAlbum } = new AlbumsController()

AlbumsRouter.get('/', getAlbums)
AlbumsRouter.get('/:albumId', getAlbum)

export default AlbumsRouter
