import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { List } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, list

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  list = await List.create({ creator: user })
})

test('POST /lists 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', desc: 'test', gift: 'test', users: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.desc).toEqual('test')
  expect(body.gift).toEqual('test')
  expect(body.users).toEqual('test')
  expect(typeof body.creator).toEqual('object')
})

test('POST /lists 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /lists 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /lists/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${list.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(list.id)
})

test('GET /lists/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /lists/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${list.id}`)
    .send({ access_token: userSession, title: 'test', desc: 'test', gift: 'test', users: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(list.id)
  expect(body.title).toEqual('test')
  expect(body.desc).toEqual('test')
  expect(body.gift).toEqual('test')
  expect(body.users).toEqual('test')
  expect(typeof body.creator).toEqual('object')
})

test('PUT /lists/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${list.id}`)
    .send({ access_token: anotherSession, title: 'test', desc: 'test', gift: 'test', users: 'test' })
  expect(status).toBe(401)
})

test('PUT /lists/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${list.id}`)
  expect(status).toBe(401)
})

test('PUT /lists/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', desc: 'test', gift: 'test', users: 'test' })
  expect(status).toBe(404)
})

test('DELETE /lists/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${list.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /lists/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${list.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /lists/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${list.id}`)
  expect(status).toBe(401)
})

test('DELETE /lists/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
