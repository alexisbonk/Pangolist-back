import { Contributors } from '.'
import { User } from '../user'

let user, contributors

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  contributors = await Contributors.create({ user, amount: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = contributors.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contributors.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.amount).toBe(contributors.amount)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = contributors.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contributors.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.amount).toBe(contributors.amount)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
