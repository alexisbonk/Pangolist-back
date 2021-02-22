import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Contributor, { schema } from './model'

const router = new Router()
const { amount } = schema.tree

/**
 * @api {post} /contributors Create contributors
 * @apiName Createcontributor
 * @apiGroup contributor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam amount contributor's amount.
 * @apiSuccess {Object} contributors contributor's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 contributor not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ amount }),
  create)

/**
 * @api {get} /contributors Retrieve contributors
 * @apiName Retrievecontributor
 * @apiGroup contributor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} contributors List of contributors.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /contributors/:id Retrieve contributors
 * @apiName Retrievecontributor
 * @apiGroup contributor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} contributors contributor's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 contributor not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /contributors/:id Update contributors
 * @apiName Updatecontributor
 * @apiGroup contributor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam amount contributor's amount.
 * @apiSuccess {Object} contributors contributor's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 contributor not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ amount }),
  update)

/**
 * @api {delete} /contributors/:id Delete contributors
 * @apiName Deletecontributor
 * @apiGroup contributor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 contributor not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
