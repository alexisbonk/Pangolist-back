import mongoose, { Schema } from 'mongoose'

const giftSchema = new Schema({
  img: {
    type: String
  },
  title: {
    type: String
  },
  desc: {
    type: String
  },
  price: {
    type: Number,
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  contributors: [{
    type: Schema.ObjectId,
    ref: 'Contributor',
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => {
      delete ret._id
    }
  }
})

giftSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      img: this.img,
      title: this.title,
      desc: this.desc,
      price: this.price,
      currentPrice: this.currentPrice,
      contributors: this.contributors.map(user => user.view(full)),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Gift', giftSchema)

export const schema = model.schema
export default model
