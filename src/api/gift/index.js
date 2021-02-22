import { Router }              from 'express'
import { middleware as query } from 'querymen'
import { middleware as body }  from 'bodymen'
import { token }               from '../../services/passport'
import {
  create,
  index,
  show,
  update,
  destroy,
  destroyImg,
  uploadResponse,
  destroyAll,
  addContributor,
}                              from './controller'
import { schema }              from './model'
import { upImgGift }           from '../../services/multer'

export Gift, { schema } from './model'
const { img, title, desc, price, amount } = schema.tree
const router = new Router()

/**
 * @api {post} /gifts Create gift
 * @apiName CreateGift
 * @apiGroup Gift
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam picture Gift's picture.
 * @apiParam title Gift's title.
 * @apiParam desc Gift's desc.
 * @apiParam url Gift's url.
 * @apiSuccess {Object} gift Gift's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gift not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({
    img,
    title,
    desc,
    price
  }),
  create,
  upImgGift,
  uploadResponse)

/**
 * @api {get} /gifts Retrieve gifts
 * @apiName RetrieveGifts
 * @apiGroup Gift
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} gifts List of gifts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /gifts/:id Retrieve gift
 * @apiName RetrieveGift
 * @apiGroup Gift
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} gift Gift's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gift not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /gifts/:id Update gift
 * @apiName UpdateGift
 * @apiGroup Gift
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam picture Gift's picture.
 * @apiParam title Gift's title.
 * @apiParam desc Gift's desc.
 * @apiParam url Gift's url.
 * @apiSuccess {Object} gift Gift's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Gift not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({
    img,
    title,
    desc,
    price
  }),
  update,
  upImgGift,
  uploadResponse)

router.post('/:id/addContributor',
  token({ required: true }),
  body({amount}),
  addContributor)

/**
 * @api {delete} /gifts/:id Delete gift
 * @apiName DeleteGift
 * @apiGroup Gift
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Gift not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

router.delete('/:id/img',
  token({ required: true }),
  destroyImg)

router.delete('/',
  token({
    required: true,
    roles: ['admin']
  }),
  destroyAll)

export default router
