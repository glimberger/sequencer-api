import mongoose, { Document } from "mongoose"
import InstrumentModel, { IInstrument } from "./instrument"
import SampleModel, { ISample } from "./sample"
import { IMutationResponse } from "../schemas"
import {
  eachArrayItem,
  isEmptyArrayOr,
  isIntegerPositive,
  isNullOr,
  isNumberPositive,
  isValidGain,
  isValidNoteResolution,
  isValidTrackColor,
  isValidUuid
} from "../utils/validators"

const GainProcessingSchema = new mongoose.Schema({
  gain: {
    type: Number,
    default: 1.0
  }
})

const FilterProcessingSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "notch"
  },
  frequency: {
    type: Number,
    default: 1000
  },
  detune: {
    type: Number,
    default: 0
  },
  gain: {
    type: Number,
    default: 1.0
  },
  q: {
    type: Number,
    default: 1.0
  }
})

const DelayProcessingSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  delayTime: {
    type: Number,
    default: 0
  }
})

const DistorsionProcessingSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  curve: {
    type: [Number],
    default: []
  },
  oversample: {
    type: String,
    default: "none"
  }
})

const AudioProcessingSchema = new mongoose.Schema({
  gain: GainProcessingSchema,
  filter: FilterProcessingSchema,
  delay: DelayProcessingSchema,
  distorsion: DistorsionProcessingSchema
})

export const CellSchema = new mongoose.Schema({
  scheduled: {
    type: Boolean,
    default: false
  },
  midi: {
    type: Number,
    default: null
  },
  processing: AudioProcessingSchema
})

export const TrackSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    validate: isValidUuid
  },
  color: {
    type: String,
    required: true,
    validate: isValidTrackColor
  },
  label: {
    type: String,
    default: "Untitled track"
  },
  noteResolution: {
    type: Number,
    default: 1,
    validate: isValidNoteResolution
  },
  instrument: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: InstrumentModel,
    required: true
  },
  muted: {
    type: Boolean,
    default: false
  },
  soloed: {
    type: Boolean,
    default: false
  },
  cells: {
    type: [CellSchema],
    required: true,
    default: Array.from(Array(64).keys()).map(() => ({
      scheduled: false,
      midi: null,
      processing: { gain: { gain: 1 } }
    }))
  },
  processing: {
    type: AudioProcessingSchema,
    default: { gain: { gain: 1 } }
  }
})

export const SessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    validate: isValidUuid
  },
  creatorID: {
    type: String,
    required: true
  },
  tempo: {
    type: Number,
    default: 120.0,
    validate: isNumberPositive
  },
  masterGain: {
    type: Number,
    default: 1.0,
    validate: isValidGain
  },
  activeTrackID: {
    type: String,
    default: null,
    validate: isNullOr(isValidUuid)
  },
  activeCellBeat: {
    type: Number,
    default: null,
    validate: isNullOr(isIntegerPositive)
  },
  trackOrder: {
    type: [String],
    default: [],
    validate: isEmptyArrayOr(eachArrayItem(isValidUuid))
  },
  tracks: {
    type: [TrackSchema],
    default: []
  },
  instruments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: InstrumentModel
    }
  ],
  samples: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: SampleModel
    }
  ],
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

SessionSchema.pre<ISession>("save", function() {
  this.createdAt = new Date()
  this.updatedAt = new Date()
})

SessionSchema.pre("findOneAndUpdate", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})

SessionSchema.pre("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } })
})

export default mongoose.model<ISession>("Session", SessionSchema)

export interface ISession extends Document {
  id: string
  creatorID: string
  tempo: number
  masterGain: number
  activeTrackID: string | null
  activeCellBeat: number | null
  trackOrder: [string]
  tracks: [
    {
      id: string
      color: string
      label: string
      noteResolution: number
      instrument: IInstrument | mongoose.Types.ObjectId
      muted: boolean
      soloed: boolean
      cells: [
        {
          scheduled: boolean
          midi: number
          processing: {
            gain: {
              gain: number
            }
            filter?: any
            delay?: any
            distorsion?: any
          }
        }
      ]
      processing: {
        gain: {
          gain: number
        }
        filter?: any
        delay?: any
        distorsion?: any
      }
    }
  ]
  instruments: [IInstrument | mongoose.Types.ObjectId]
  samples: [ISample | mongoose.Types.ObjectId]
  createdAt: Date
  updatedAt: Date
}

export interface ISessionCreateInput {
  creatorID: ISession["creatorID"]
}

export interface ISessionUpdateInput {
  sessionID: ISession["id"]
  instrumentID?: IInstrument["id"]
}

export interface ISessionMutationResponse extends IMutationResponse {
  session?: ISession
}
