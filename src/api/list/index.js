import { Router }              from 'express'
import { middleware as query } from 'querymen'
import { middleware as body }  from 'bodymen'
import { token }               from '../../services/passport'
import {
  create,
  index,
  show,
  update,
  addGift, delGift,
  addUser, delUser,
  showMe, showWhereInvited,
  destroy,
  destroyImg,
  destroyAll,
  uploadResponse,
}                              from './controller'
import { schema }              from './model'
import { upImgList }           from '../../services/multer'

export List, { schema }        from './model'
const router = new Router()
const { img, title, desc, location, deadline } = schema.tree

/**
 * @api {post} /lists Create list
 * @apiName CreateList
 * @apiGroup List
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} list List's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 List not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({
    title,
    desc,
    location,
    deadline
  }),
  create,
  upImgList,
  uploadResponse)

/**
 * @api {get} /lists Retrieve lists
 * @apiName RetrieveLists
 * @apiGroup List
 * @apiUse listParams
 * @apiSuccess {Object[]} lists List of lists.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

router.get('/me',
  token({ required: true }),
  showMe
)

router.get('/whereInvited',
  token({ required: true }),
  showWhereInvited
)

/**
 * @api {get} /lists/:id Retrieve list
 * @apiName RetrieveList
 * @apiGroup List
 * @apiSuccess {Object} list List's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 List not found.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /lists/:id Update list
 * @apiName UpdateList
 * @apiGroup List
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} list List's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 List not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({
    img,
    title,
    desc,
    location,
    deadline
  }),
  update,
  upImgList,
  uploadResponse)

router.post('/:listId/addGift/:giftId',
  token({ required: true }),
  body({}),
  addGift)

router.post('/:listId/deleteGift/:giftId',
  token({ required: true }),
  body({}),
  delGift)

router.post('/:listId/addUser/:userId',
  token({ required: true }),
  body({}),
  addUser)

router.delete('/:listId/DeleteUser/:userId',
  token({ required: true }),
  body({}),
  delUser)

/**
 * @api {delete} /lists/:id Delete list
 * @apiName DeleteList
 * @apiGroup List
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 List not found.
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
