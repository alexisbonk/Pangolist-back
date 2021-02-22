import mongoose, { Schema } from 'mongoose'

const listSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  img: {
    type: String
  },
  title: {
    type: String,
  },
  desc: {
    type: String
  },
  gifts: [{
    type: Schema.ObjectId,
    ref: 'Gift'
  }],
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  location: {
    type: String
  },
  deadline: {
    type: String
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

listSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['id', 'img', 'title']

    if (full) {
      fields = [...fields, 'desc', 'creator', 'gifts', 'users', 'location', 'deadline', 'createdAt', 'updatedAt']
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  }
}

const model = mongoose.model('List', listSchema)

export const schema = model.schema
export default model
