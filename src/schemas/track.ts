import { gql } from "apollo-server-express"

const schema = gql`
  """
  A track part of the session sequencer
  """
  type Track {
    "Primary key (UUIDv4)"
    id: ID!

    "Track label"
    label: String!

    "Track color"
    color: MaterialColor!

    "Track note resolution — 1=16th note, 2=8th note, 4=quarter note"
    noteResolution: Int!

    "Instrument used to build the track"
    instrument: Instrument!

    "Track mute enabled"
    muted: Boolean!

    "Track solo enabled"
    soloed: Boolean!

    "Row of cells (64) to be clock played — row index as beat number"
    cells: [Cell!]!

    "Audio processing settings"
    processing: AudioProcessing!
  }

  """
  A note to be played
  """
  type Cell {
    "Note scheduled or not"
    scheduled: Boolean!

    "MIDI note [0, 127]"
    midi: Int!

    "Audio processing settings"
    processing: AudioProcessing!
  }
`

export default schema
