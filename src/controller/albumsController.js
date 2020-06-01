const albums = [
  {
    id: 1,
    title: 'quidem molestiae enim',
  },
  {
    id: 2,
    title: 'sunt qui excepturi placeat culpa',
  },
  {
    id: 3,
    title: 'omnis laborum odio',
  },
  {
    id: 4,
    title: 'non esse culpa molestiae omnis sed optio',
  },
  {
    id: 5,
    title: 'eaque aut omnis a',
  },
  {
    id: 6,
    title: 'natus impedit quibusdam illo est',
  },
  {
    id: 7,
    title: 'quibusdam autem aliquid et et quia',
  },
  {
    id: 8,
    title: 'qui fuga est a eum',
  },
  {
    id: 9,
    title: 'saepe unde necessitatibus rem',
  },
  {
    id: 10,
    title: 'distinctio laborum qui',
  },
]

class AlbumsController {
  getAlbums = async ctx => {
    ctx.body = albums
  }

  getAlbum = async ctx => {
    const {
      params: { albumId },
    } = ctx

    const parsedAlbumId = parseInt(albumId, 10)
    const album = albums.find(item => item.id === parsedAlbumId)

    if (!album) {
      ctx.throw(404, 'No Album')
    }
    ctx.body = album
  }
}

export default AlbumsController
