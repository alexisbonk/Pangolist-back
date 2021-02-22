import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Contributor } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Contributor.create({ ...body, user })
    .then((contributor) => contributor.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Contributor.find(query, select, cursor)
    .populate('user')
    .then((contributor) => contributor.map((contributor) => contributor.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Contributor.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((contributor) => contributor ? contributor.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Contributor.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contributor) => contributor ? Object.assign(contributor, body).save() : null)
    .then((contributor) => contributor ? contributor.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Contributor.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contributor) => contributor ? contributor.remove() : null)
    .then(success(res, 204))
    .catch(next)
