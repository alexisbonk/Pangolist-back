import { success, notFound } from '../../services/response/'
import { User }              from '.'
import { sign }              from '../../services/jwt'
import { deleteImg }         from '../../services/multer'

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then(user => {
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.find(query, select, cursor)
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const update = (req, res, next) => {
  const { bodymen: { body }, params, user } = req
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      Object.keys(body).forEach(key => {
        if (body[key] === undefined) {
          delete body[key]
        }
      })
      return result
    })
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then(user => {
      req.user = user
      req.expectedStatus = 200
      next()
    })
    .catch(next)
}

export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({ password: body.password }).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const uploadResponse = (req, res, next) => {
  if (req.file) {
    req.user.img = req.file.filename
    req.user.save()
      .then((user) => user.view(true))
      .then((success(res, req.expectedStatus)))
      .catch(next)
  } else {
    success(res, req.expectedStatus)(req.user.view(true))
  }
}

export const destroyImg = ({ user, params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(deleteImg(res, 'upload/user/'))
    .then((user) => {
      user.img = undefined
      return user.save()
    })
    .then((user) => user ? user.view() : null)
    .then(success(res, 200))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
