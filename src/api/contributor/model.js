import mongoose, { Schema } from 'mongoose'

const contributorSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

contributorSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      amount: this.amount,
      createdAt: this.createdAt,
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Contributor', contributorSchema)

export const schema = model.schema
export default model
