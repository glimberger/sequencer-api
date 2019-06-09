import { IMaterialColor } from "../schemas/color"

export const isValidUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    v
  )

export const isValidAudioMIMEType = (v: string) => /^audio\//.test(v)

export const isValidMidiNote = (v: number) => v >= 0 && v < 128

export const isValidDetune = (v: number) => v >= -1200 && v <= 1200

export const isValidGain = (v: number) => v > -3.4028235e38 && v < 3.4028235e38

export const isNumberPositive = (v: number) => v > 0

export const isIntegerPositive = (v: number) =>
  Number.isInteger(v) && isNumberPositive(v)

export const isNullOr = (fn: (v: any) => boolean) => (
  v: string | number | null
) => (v === null ? true : fn(v))

export const isEmptyArrayOr = (fn: (v: any) => boolean) => (v: any[]) =>
  v.length === 0 || fn(v)

export const eachArrayItem = (fn: (v: any) => boolean) => (v: any[]) =>
  v.reduce(
    (valid: boolean, currentValue: boolean) => valid && fn(currentValue),
    true
  )

export const isValidTrackColor = (v: IMaterialColor) =>
  [
    "red",
    "pink",
    "purple",
    "deepPurple",
    "indigo",
    "blue",
    "lightBlue",
    "cyan",
    "teal",
    "green",
    "lightGreen",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deepOrange"
  ].includes(v)

export const isValidNoteResolution = (v: number) => [1, 2, 4].includes(v)

export const hasFileExtension = (v: string) => v.split(".").length > 1