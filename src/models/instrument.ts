import mongoose, { HookNextFunction, Document } from "mongoose"
import SampleModel, { ISample } from "./sample"
import { IMutationResponse } from "../schemas"
import { isValidDetune, isValidMidiNote, isValidUuid } from "../utils/validators"

export const InstrumentMappingSchema = new mongoose.Schema({
  note: {
    type: Number,
    required: true,
    validate: [
      { validator: Number.isInteger, msg: "Integer required" },
      { validator: isValidMidiNote, msg: "Not a valid MIDI note" }
    ]
  },
  sample: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: SampleModel,
    required: true
  },
  detune: {
    type: Number,
    required: true,
    validate: [
      { validator: Number.isInteger, msg: "Integer required" },
      { validator: isValidDetune, msg: "Not a valid detune value" }
    ]
  }
})

export const InstrumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    validate: isValidUuid
  },
  label: {
    type: String,
    required: true
  },
  group: {
    type: String,
    default: "NO_GROUP"
  },
  samples: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: SampleModel,
      required: true
    }
  ],
  mapping: {
    type: [InstrumentMappingSchema]
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

const autoPopulate = function(next: HookNextFunction) {
  this.populate("samples")
  this.populate("mapping.sample")
  next()
}

InstrumentSchema.pre<IInstrument>("save", function() {
  this.createdAt = new Date()
  this.updatedAt = new Date()
})

InstrumentSchema.pre("findOne", autoPopulate).pre("find", autoPopulate)

InstrumentSchema.pre("findOneAndUpdate", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})
InstrumentSchema.pre("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})

export default mongoose.model<IInstrument>("Instrument", InstrumentSchema)

export interface IInstrument extends Document {
  id: string
  label: string
  samples: [ISample | mongoose.Types.ObjectId]
  mapping: [IInstrumentMapping]
  createdAt: Date
  updatedAt: Date
}

export interface IInstrumentMapping {
  note: number
  sample: ISample | ISample["_id"]
  detune: number
}

export interface IInstrumentMutationResponse extends IMutationResponse {
  instrument?: IInstrument
}

export interface IInstrumentCreateInput {
  label: string
  group: string
  mapping: [{ note: number; sampleID: string; detune: number }]
}
