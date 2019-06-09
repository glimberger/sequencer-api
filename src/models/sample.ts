import mongoose, { Document } from "mongoose"
import { IMutationResponse, IUpload } from "../schemas"
import { hasFileExtension, isValidAudioMIMEType, isValidUuid } from "../utils/validators"

export const sampleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    validate: isValidUuid
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  filename: {
    type: String,
    required: true,
    validate: {
      validator: hasFileExtension
    }
  },
  type: {
    type: String,
    required: true,
    validate: isValidAudioMIMEType
  },
  label: {
    type: String,
    required: true
  },
  group: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

sampleSchema.pre("findOneAndUpdate", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})

sampleSchema.pre("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})

export default mongoose.model<ISample>("Sample", sampleSchema)

export interface ISample extends Document {
  id: string
  url: string
  filename: string
  type: string
  label: string
  group: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ISampleMutationResponse extends IMutationResponse {
  sample?: ISample
}

export interface ISampleCreateInput {
  file: Promise<IUpload>
  label?: ISample["label"]
  group?: ISample["group"]
}
