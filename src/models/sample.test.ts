import mongoose from "mongoose"
import Sample from "./sample"

describe("Sample model", () => {
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

  let sample
  let error

  it("should throw validation errors", () => {
    sample = new Sample()

    expect(sample.validate).toThrow()
  })

  it("should validate id prop", () => {
    sample = new Sample()
    error = sample.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    sample = new Sample({ id: "foo" })
    error = sample.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    sample = new Sample({ id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0" })
    error = sample.validateSync("id")
    expect(error).toBeUndefined()
  })

  it("should validate filename prop", () => {
    sample = new Sample()
    error = sample.validateSync("filename")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("filename")

    sample = new Sample({ filename: "foo" })
    error = sample.validateSync("filename")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("filename")

    sample = new Sample({ filename: "foo.bar" })
    error = sample.validateSync("filename")
    expect(error).toBeUndefined()
  })

  it("should validate url prop", () => {
    sample = new Sample()
    error = sample.validateSync("url")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("url")

    sample = new Sample({ url: "/samples/foo" })
    error = sample.validateSync("url")
    expect(error).toBeUndefined()
  })

  it("should validate type prop", () => {
    sample = new Sample()
    error = sample.validateSync("type")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("type")

    sample = new Sample({ type: "foo" })
    error = sample.validateSync("type")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("type")

    sample = new Sample({ type: "audio/bar" })
    error = sample.validateSync("type")
    expect(error).toBeUndefined()
  })

  it("should validate label prop", () => {
    sample = new Sample()
    error = sample.validateSync("label")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("label")

    sample = new Sample({ label: "foobar" })
    error = sample.validateSync("label")
    expect(error).toBeUndefined()
  })

  it("should validate label prop", () => {
    sample = new Sample()
    error = sample.validateSync("label")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("label")

    sample = new Sample({ label: "foobar" })
    error = sample.validateSync("label")
    expect(error).toBeUndefined()
  })

  it("should save and update a sample", async () => {
    await Sample.findOneAndDelete({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0"
    })

    expect.assertions(5)

    sample = new Sample({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0",
      filename: "toto.wav",
      url: "/samples/eac4c8a2-8801-4b9b-95d7-c0788791a4e0.wav",
      type: "audio/wave",
      label: "foo"
    })

    const spyOnSave = jest.spyOn(sample, "save")
    await sample.save()

    expect(spyOnSave).toHaveBeenCalled()

    expect(sample).toMatchObject({
      id: expect.any(String),
      filename: expect.any(String),
      url: expect.any(String),
      type: expect.any(String),
      label: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })

    const spyOnUpdate = jest.spyOn(sample, "updateOne")
    const result = await sample.updateOne(
      { id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0" },
      { $set: { label: "bar" } }
    )

    expect(spyOnUpdate).toHaveBeenCalled()
    expect(result.ok).toBeTruthy()

    const updatedSample = await Sample.findById(sample._id)
    expect(updatedSample.updatedAt.valueOf()).toBeGreaterThan(
      updatedSample.createdAt.valueOf()
    )
  })
})
