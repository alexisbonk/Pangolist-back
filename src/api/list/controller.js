import { success, notFound, authorOrAdmin } from '../../services/response/'
import { List }                             from '.'
import { Gift }                             from '../gift/.'
import { User }                             from '../user/.'
import { deleteAllImg, deleteImg }          from '../../services/multer/'
import { sendMessage }                      from '../../services/oneSignal'
import { Contributor }                      from '../contributor'

export const create = ({ user, bodymen: { body } }, res, next) =>
  List.create({ ...body, creator: user })
    .then((list) => list.view(true))
    .then(success(res, 201))
    .catch(next)


export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  List.find(query, select, cursor)
    .then((lists) => lists.map((list) => list.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  List.findById(params.id)
    .populate({
      path: 'creator',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'users',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'gifts',
      populate: {
        path: 'contributors',
        populate: {
          path: 'user',
          select: ['id', 'email', 'name', 'img']
        }
      }
    })
    .then(notFound(res))
    .then((list) => list ? list.view(true) : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res, next) =>
  List.find({ creator: { $eq: user.id } })
    .then(notFound(res))
    .then((list) => list.map((list) => list.view()))
    .then(success(res))
    .catch(next)

export const showWhereInvited = ({ user }, res, next) =>
  List.find({ users: { $eq: user.id } })
    .then(notFound(res))
    .then((list) => list.map((list) => list.view()))
    .then(success(res))
    .catch(next)

export const update = (req, res, next) => {
  const { user, bodymen: { body }, params } = req
  List.findById(params.id)
    .populate({
      path: 'creator',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'users',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'gifts',
      populate: {
        path: 'contributors',
        populate: {
          path: 'user',
          select: ['id', 'email', 'name', 'img']
        }
      }
    })
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then((list) => {
      Object.keys(body).forEach(key => {
        if (body[key] === undefined) {
          delete body[key]
        }
      })
      return list
    })
    .then((list) => list ? Object.assign(list, body).save() : null)
    .then(list => {
      req.list = list
      req.expectedStatus = 200
      next()
    })
    .catch(next)
}

export const addGift = ({ user, bodymen: { body }, params }, res, next) =>
  Promise.all([List.findById(params.listId), Gift.findById(params.giftId)])
    .then(([list, giftFound]) => {
      if (list.gifts.findIndex(giftList => params.giftId.toString() === giftList.toString()) === -1) {
        list.gifts.push(giftFound.id)
      } else {
        res.status(409).json({ error: 'Gift already add' }).end()
      }
      return list.save()
    })
    .then(list =>
      list.populate({
        path: 'creator',
        select: ['id', 'email', 'name', 'img']
      })
        .populate({
          path: 'users',
          select: ['id', 'email', 'name', 'img']
        })
        .populate({
          path: 'gifts',
          populate: {
            path: 'contributors',
            populate: {
              path: 'user',
              select: ['id', 'email', 'name', 'img']
            }
          }
        }).execPopulate())
    .then((list) => list ? list.view(true) : null)
    .then(list => sendMessage(list.gifts[list.gifts.length - 1].title + ' à été ajouté à “ ' + list.title + ' ” !', list.users.map(user => user.id.toString())).then(() => list))
    .then(success(res))
    .catch(next)

export const delGift = ({ user, bodymen: { body }, params }, res, next) =>
  Promise.all([List.findById(params.listId), Gift.findById(params.giftId)])
    .then(([list, giftFound]) => {
      const giftIndex = list.gifts.findIndex(giftList => params.giftId.toString() === giftList.toString())
      if (giftIndex !== -1) {
        list.gifts.splice(giftIndex, 1)
      } else {
        res.status(404).json({ error: 'Gift not found' }).end()
      }
      return list.save()
    })
    .then(list =>
      list.populate({
        path: 'creator',
        select: ['id', 'email', 'name', 'img']
      })
        .populate({
          path: 'users',
          select: ['id', 'email', 'name', 'img']
        })
        .populate({
          path: 'gifts',
          populate: {
            path: 'contributors',
            populate: {
              path: 'user',
              select: ['id', 'email', 'name', 'img']
            }
          }
        }).execPopulate())
    .then((list) => list ? list.view(true) : null)
    .then(success(res))
    .catch(next)

export const addUser = ({ user, bodymen: { body }, params }, res, next) =>
  Promise.all([List.findById(params.listId), User.findById(params.userId)])
    .then(([list, userFound]) => {
      if ((list.creator.toString() !== params.userId.toString())
        && (list.users.findIndex(userList => params.userId.toString() === userList.toString()) === -1)) {
        list.users.push(userFound.id)
      } else {
        res.status(409).json({ error: 'User already add or is creator of this list' }).end()
      }
      return list.save()
    })
    .then(list =>
      list.populate({
        path: 'creator',
        select: ['id', 'email', 'name', 'img']
      })
        .populate({
          path: 'users',
          select: ['id', 'email', 'name', 'img']
        })
        .populate({
          path: 'gifts',
          populate: {
            path: 'contributors',
            populate: {
              path: 'user',
              select: ['id', 'email', 'name', 'img']
            }
          }
        }).execPopulate())
    .then((list) => list ? list.view(true) : null)
    .then(list => sendMessage(list.users[list.users.length - 1].name + ' à été ajouté à “ ' + list.title + ' ” !', list.users.map(user => user.id.toString())).then(() => list))
    .then(list => sendMessage(list.users[list.users.length - 1].name + ' à été ajouté à “ ' + list.title + ' ” !', list.creator.id.toString()).then(() => list))
    .then(success(res))
    .catch(next)

export const delUser = ({ user, bodymen: { body }, params }, res, next) =>
  Promise.all([List.findById(params.listId), User.findById(params.userId)])
    .then(([list, userFound]) => {
      const userIndex = list.users.findIndex(userList => params.userId.toString() === userList.toString())
      if (userIndex !== -1) {
        list.users.splice(userIndex, 1)
      } else {
        res.status(404).json({ error: 'User not found' }).end()
      }
      return list.save()
    })
    .then(list =>
      list.populate({
        path: 'creator',
        select: ['id', 'email', 'name', 'img']
      })
        .populate({
          path: 'users',
          select: ['id', 'email', 'name', 'img']
        })
        .populate({
          path: 'gifts',
          populate: {
            path: 'contributors',
            populate: {
              path: 'user',
              select: ['id', 'email', 'name', 'img']
            }
          }
        }).execPopulate())
    .then((list) => list ? list.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  List.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then(deleteImg(res, 'upload/list/'))
    .then((list) => list ? list.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const destroyImg = ({ user, params }, res, next) =>
  List.findById(params.id)
    .populate({
      path: 'creator',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'users',
      select: ['id', 'email', 'name', 'img']
    })
    .populate({
      path: 'gifts',
      populate: {
        path: 'contributors',
        populate: {
          path: 'user',
          select: ['id', 'email', 'name', 'img']
        }
      }
    })
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then(deleteImg(res, 'upload/list/'))
    .then((list) => {
      list.img = undefined
      return list.save()
    })
    .then((list) => list ? list.view(true) : null)
    .then(success(res, 200))
    .catch(next)

export const uploadResponse = (req, res, next) => {
  if (req.file) {
    req.list.img = req.file.filename
    req.list.save()
      .then((list) => list.view(true))
      .then((success(res, req.expectedStatus)))
      .catch(next)
  } else {
    success(res, req.expectedStatus)(req.list.view(true))
  }
}

export const destroyAll = ({ user, params }, res, next) =>
  List.deleteMany()
    .then(deleteAllImg(res, 'upload/list'))
    .then(success(res, 204))
    .catch(next)
