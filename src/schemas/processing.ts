import { gql } from "apollo-server-express"

const schema = gql`
  """
  Audio processing settings
  """
  type AudioProcessing {
    gain: GainProcessing!,
    filter: FilterProcessing,
    delay: DelayProcessing,
    distorsion: DistorsionProcessing
  }

  """
  Gain settings for audio processing

  https://webaudio.github.io/web-audio-api/#gainnode
  """
  type GainProcessing {
    "Amount of gain"
    gain: Float!
  }

  """
  Filter settings for audio processing

  https://webaudio.github.io/web-audio-api/#biquadfilternode
  """
  type FilterProcessing {
    enabled: Boolean!

    "Filter type"
    type: FilterType!

    "Filter frequency in Hz"
    frequency: Float!

    "Detuning of the frequency in cents"
    detune: Int

    "Filter gain"
    gain: Float!

    "Filter quality factor"
    q: Float
  }

  """
  Enumeration of filter type for the filter audio processing
  """
  enum FilterType {
    lowpass
    highpass
    bandpass
    lowshelf
    highshelf
    peaking
    notch
    allpass
  }

  """
  Delay settings for audio processing

  https://webaudio.github.io/web-audio-api/#DelayNode
  """
  type DelayProcessing {
    enabled: Boolean!

    "Amount of delay in s"
    delayTime: Float!
  }

  """
  Disorsion settings for audio processing

  https://webaudio.github.io/web-audio-api/#waveshapernode
  """
  type DistorsionProcessing {
    enabled: Boolean!

    "Shaping curve"
    curve: [Float!]!

    "Type of oversampling"
    oversample: OversamplingType!
  }

  """
  Enumeration of oversampling types for distorsion audio processing
  """
  enum OversamplingType {
    none
    twoTimes
    fourTimes
  }
`

export default schema
