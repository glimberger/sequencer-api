import mongoose from "mongoose"
import Instrument from "./instrument"

describe("Instrument model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost/sequencer_test", {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  })

  afterAll(async () => {
    mongoose.connection.close()
  })

  let instrument
  let error

  it("should throw validation errors", () => {
    const instr = new Instrument()

    expect(instr.save).toThrow()
  })

  it("should validate id prop", () => {
    instrument = new Instrument()
    error = instrument.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    instrument = new Instrument({ id: "foo" })
    error = instrument.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    instrument = new Instrument({ id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0" })
    error = instrument.validateSync("id")
    expect(error).toBeUndefined()
  })

  it("should validate label prop", () => {
    instrument = new Instrument()
    error = instrument.validateSync("label")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("label")

    instrument = new Instrument({ label: "foobar" })
    error = instrument.validateSync("label")
    expect(error).toBeUndefined()
  })

  it("should validate samples prop", () => {
    instrument = new Instrument()
    error = instrument.validateSync("samples")
    expect(error).toBeUndefined()

    instrument = new Instrument({ samples: [] })
    error = instrument.validateSync("samples")
    expect(error).toBeUndefined()

    instrument = new Instrument()
    // @ts-ignore
    try {
      // @ts-ignore
      instrument.samples.push("foo")
    } catch (e) {
      expect(e).toBeInstanceOf(mongoose.Error)
    }

    instrument = new Instrument()
    instrument.samples.push(mongoose.Types.ObjectId())
    error = instrument.validateSync("samples")
    expect(error).toBeUndefined()
  })

  it("should validate mapping prop", () => {
    instrument = new Instrument()
    error = instrument.validateSync("mapping")
    expect(error).toBeUndefined()

    instrument = new Instrument({ mapping: [] })
    error = instrument.validateSync("mapping")
    expect(error).toBeUndefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({})
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.note"]).toBeDefined()
    expect(error.errors["mapping.0.sample"]).toBeDefined()
    expect(error.errors["mapping.0.detune"]).toBeDefined()

    instrument = new Instrument()
    instrument.mapping.push({
      note: 0,
      detune: 0,
      sample: mongoose.Types.ObjectId()
    })
    error = instrument.validateSync("mapping")
    expect(error).toBeUndefined()
  })

  it("should validate mapping.note prop", () => {
    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ note: 1.5 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.note"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ note: 250 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.note"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ note: -4 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.note"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ note: 69 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.note"]).toBeUndefined()
  })

  it("should validate mapping.detune prop", () => {
    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ detune: 1.5 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.detune"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ detune: -2500 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.detune"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ detune: 2500 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.detune"]).toBeDefined()

    instrument = new Instrument()
    // @ts-ignore
    instrument.mapping.push({ detune: 100 })
    error = instrument.validateSync("mapping")
    expect(error).toBeDefined()
    expect(error.errors["mapping.0.detune"]).toBeUndefined()
  })

  it("should save and update a instrument", async () => {
    await Instrument.findOneAndDelete({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0"
    })
    expect.assertions(5)

    instrument = new Instrument({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0",
      label: "foo",
      samples: [mongoose.Types.ObjectId()],
      mapping: [{ note: 0, detune: 0, sample: mongoose.Types.ObjectId() }]
    })

    const spyOnSave = jest.spyOn(instrument, "save")
    await instrument.save()

    expect(spyOnSave).toHaveBeenCalled()

    expect(instrument).toMatchObject({
      id: expect.any(String),
      label: expect.any(String),
      samples: expect.any(Array),
      mapping: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })

    const spyOnUpdate = jest.spyOn(instrument, "updateOne")

    instrument.samples.push(mongoose.Types.ObjectId())
    instrument.mapping.push({
      note: 69,
      detune: 100,
      sample: mongoose.Types.ObjectId()
    })
    const result = await instrument.updateOne(
      { id: instrument.id },
      { $set: { label: "bar" } }
    )

    expect(spyOnUpdate).toHaveBeenCalled()
    expect(result.ok).toBeTruthy()

    const updatedInstrument = await Instrument.findById(instrument._id)
    expect(updatedInstrument.updatedAt.valueOf()).toBeGreaterThan(
      updatedInstrument.createdAt.valueOf()
    )
  })
})
