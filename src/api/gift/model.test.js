import { Gift } from '.'

let gift

beforeEach(async () => {
  gift = await Gift.create({ picture: 'test', title: 'test', desc: 'test', url: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = gift.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(gift.id)
    expect(view.picture).toBe(gift.picture)
    expect(view.title).toBe(gift.title)
    expect(view.desc).toBe(gift.desc)
    expect(view.url).toBe(gift.url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = gift.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(gift.id)
    expect(view.picture).toBe(gift.picture)
    expect(view.title).toBe(gift.title)
    expect(view.desc).toBe(gift.desc)
    expect(view.url).toBe(gift.url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
