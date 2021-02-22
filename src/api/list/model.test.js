import { List } from '.'
import { User } from '../user'

let user, list

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  list = await List.create({ creator: user, title: 'test', desc: 'test', gift: 'test', users: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = list.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(list.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.title).toBe(list.title)
    expect(view.desc).toBe(list.desc)
    expect(view.gift).toBe(list.gift)
    expect(view.users).toBe(list.users)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = list.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(list.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.title).toBe(list.title)
    expect(view.desc).toBe(list.desc)
    expect(view.gift).toBe(list.gift)
    expect(view.users).toBe(list.users)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
