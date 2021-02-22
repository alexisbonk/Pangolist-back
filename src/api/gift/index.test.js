import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Gift } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, gift

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  gift = await Gift.create({})
})

test('POST /gifts 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, picture: 'test', title: 'test', desc: 'test', url: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.picture).toEqual('test')
  expect(body.title).toEqual('test')
  expect(body.desc).toEqual('test')
  expect(body.url).toEqual('test')
})

test('POST /gifts 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /gifts 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /gifts 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /gifts 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /gifts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${gift.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(gift.id)
})

test('GET /gifts/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${gift.id}`)
  expect(status).toBe(401)
})

test('GET /gifts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /gifts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${gift.id}`)
    .send({ access_token: userSession, picture: 'test', title: 'test', desc: 'test', url: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(gift.id)
  expect(body.picture).toEqual('test')
  expect(body.title).toEqual('test')
  expect(body.desc).toEqual('test')
  expect(body.url).toEqual('test')
})

test('PUT /gifts/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${gift.id}`)
  expect(status).toBe(401)
})

test('PUT /gifts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, picture: 'test', title: 'test', desc: 'test', url: 'test' })
  expect(status).toBe(404)
})

test('DELETE /gifts/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${gift.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /gifts/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${gift.id}`)
  expect(status).toBe(401)
})

test('DELETE /gifts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
