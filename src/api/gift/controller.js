import { success, notFound }       from '../../services/response/'
import { Gift }                    from '.'
import { deleteAllImg, deleteImg } from '../../services/multer/'
import { Contributor }             from '../contributor/index'
import { List }                    from '../list/index'
import { sendMessage }             from '../../services/oneSignal'

export const create = (req, res, next) => {
  const { bodymen: { body } } = req
  Gift.create({ ...body })
    .then(gift => {
      req.gift = gift
      req.expectedStatus = 201
      next()
    })
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Gift.find(query, select, cursor)
    .populate({
      path: 'contributors',
      populate: {
        path: 'user'
      }
    })
    .then((gifts) => gifts.map((gift) => gift.view(true)))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Gift.findById(params.id)
    .populate({
      path: 'contributors',
      populate: {
        path: 'user'
      }
    })
    .then(notFound(res))
    .then((gift) => gift ? gift.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = (req, res, next) => {
  const { bodymen: { body }, params } = req
  Gift.findById(params.id)
    .populate({
      path: 'contributors',
      populate: {
        path: 'user'
      }
    })
    .then(notFound(res))
    .then((gift) => {
      Object.keys(body).forEach(key => {
        if (body[key] === undefined) {
          delete body[key]
        }
      })
      return gift
    })
    .then((gift) => gift ? Object.assign(gift, body).save() : null)
    .then(gift => {
      req.gift = gift
      req.expectedStatus = 200
      next()
    })
    .catch(next)
}

export const addContributor = ({ user, bodymen: { body }, params }, res, next) =>
  Gift.findById(params.id).then(gift => {
    const amount = parseInt(body.amount)
    if (amount > (gift.price - gift.currentPrice)) {
      res.status(400).json({ error: 'amount > price' }).end()
      throw null
    }
    return Promise.all([gift.populate().execPopulate(),
      Contributor.create({
        ...body,
        user
      }),
      List.findOne({ gifts: gift.id }).populate({ path: 'gifts' }).exec()
    ])
  })
    .then(([gift, contributor, list]) => {
      gift.contributors.push(contributor.id)
      gift.currentPrice += contributor.amount
      if (gift.price === gift.currentPrice) {
        sendMessage(gift.title + ' de la liste ' + '“ ' + list.title + ' ”' + ' à atteint le budget nécessaire  !',
          list.users.map(user => user.toString()))
        sendMessage(gift.title + ' de la liste ' + '“ ' + list.title + ' ”' + ' à atteint le budget nécessaire  !',
          list.creator.toString())
      }
      return gift.save()
    })
    .then(gift => gift.populate({
      path: 'contributors',
      populate: {
        path: 'user'
      }
    }).execPopulate())
    .then((gift) => gift ? gift.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Gift.findById(params.id)
    .then(notFound(res))
    .then(deleteImg(res, 'upload/gift/'))
    .then((gift) => gift ? gift.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const destroyImg = ({ user, params }, res, next) =>
  Gift.findById(params.id)
    .then(notFound(res))
    .then(deleteImg(res, 'upload/gift/'))
    .then((gift) => {
      gift.img = undefined
      return gift.save()
    })
    .then((gift) => gift ? gift.view() : null)
    .then(success(res, 200))
    .catch(next)

export const uploadResponse = (req, res, next) => {
  if (req.file) {
    req.gift.img = req.file.filename
    req.gift.save()
      .then((gift) => gift.view(true))
      .then((success(res, req.expectedStatus)))
      .catch(next)
  } else {
    success(res, req.expectedStatus)(req.gift.view(true))
  }
}

export const destroyAll = ({ user, params }, res, next) =>
  Gift.deleteMany()
    .then(deleteAllImg(res, 'upload/gift'))
    .then(success(res, 204))
    .catch(next)
