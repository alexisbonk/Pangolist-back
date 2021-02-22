import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Contributors } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, contributors

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  contributors = await Contributors.create({ user })
})

test('POST /contributors 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, amount: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.amount).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /contributors 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contributors 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /contributors 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contributors/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${contributors.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contributors.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /contributors/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${contributors.id}`)
  expect(status).toBe(401)
})

test('GET /contributors/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /contributors/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${contributors.id}`)
    .send({ access_token: userSession, amount: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contributors.id)
  expect(body.amount).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /contributors/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contributors.id}`)
    .send({ access_token: anotherSession, amount: 'test' })
  expect(status).toBe(401)
})

test('PUT /contributors/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contributors.id}`)
  expect(status).toBe(401)
})

test('PUT /contributors/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, amount: 'test' })
  expect(status).toBe(404)
})

test('DELETE /contributors/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contributors.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /contributors/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contributors.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /contributors/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contributors.id}`)
  expect(status).toBe(401)
})

test('DELETE /contributors/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
