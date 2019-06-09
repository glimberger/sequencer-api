import mongoose from "mongoose"
import Session from "./session"

describe("Session model", () => {
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

  let session
  let error

  it("should throw validation errors", () => {
    session = new Session()

    expect(session.validate).toThrow()
  })

  it("should validate id prop", () => {
    session = new Session()
    error = session.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    session = new Session({ id: "foo" })
    error = session.validateSync("id")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("id")

    session = new Session({ id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0" })
    error = session.validateSync("id")
    expect(error).toBeUndefined()
  })

  it("should validate creatorID prop", () => {
    session = new Session()
    error = session.validateSync("creatorID")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("creatorID")

    session = new Session({ creatorID: "foo" })
    error = session.validateSync("creatorID")
    expect(error).toBeUndefined()
  })

  it("should validate tempo prop", () => {
    session = new Session()
    error = session.validateSync("tempo")
    expect(error).toBeUndefined()

    session = new Session({ tempo: -1 })
    error = session.validateSync("tempo")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("tempo")

    session = new Session({ tempo: 1.3 })
    error = session.validateSync("tempo")
    expect(error).toBeUndefined()
  })

  it("should validate gain prop", () => {
    session = new Session()
    error = session.validateSync("masterGain")
    expect(error).toBeUndefined()

    session = new Session({ masterGain: Number.MAX_VALUE })
    error = session.validateSync("masterGain")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("masterGain")

    session = new Session({ masterGain: -Number.MAX_VALUE })
    error = session.validateSync("masterGain")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("masterGain")

    session = new Session({ masterGain: Number.MAX_SAFE_INTEGER })
    error = session.validateSync("masterGain")
    expect(error).toBeUndefined()
  })

  it("should validate activeTrackID prop", () => {
    session = new Session()
    error = session.validateSync("activeTrackID")
    expect(error).toBeUndefined()

    session = new Session({ activeTrackID: "foo" })
    error = session.validateSync("activeTrackID")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("activeTrackID")

    session = new Session({
      activeTrackID: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0"
    })
    error = session.validateSync("activeTrackID")
    expect(error).toBeUndefined()

    session = new Session({ activeTrackID: null })
    error = session.validateSync("activeTrackID")
    expect(error).toBeUndefined()
  })

  it("should validate activeCellBeat prop", () => {
    session = new Session()
    error = session.validateSync("activeCellBeat")
    expect(error).toBeUndefined()

    session = new Session({ activeCellBeat: -2 })
    error = session.validateSync("activeCellBeat")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("activeCellBeat")

    session = new Session({ activeCellBeat: 2.5 })
    error = session.validateSync("activeCellBeat")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("activeCellBeat")

    session = new Session({ activeCellBeat: 1 })
    error = session.validateSync("activeCellBeat")
    expect(error).toBeUndefined()

    session = new Session({ activeCellBeat: null })
    error = session.validateSync("activeCellBeat")
    expect(error).toBeUndefined()
  })

  it("should validate trackOrder prop", () => {
    session = new Session()
    error = session.validateSync("trackOrder")
    expect(error).toBeUndefined()

    session = new Session({ trackOrder: [] })
    error = session.validateSync("trackOrder")
    expect(error).toBeUndefined()

    session = new Session()
    session.trackOrder.push("eac4c8a2-8801-4b9b-95d7-c0788791a4e0")
    error = session.validateSync("trackOrder")
    expect(error).toBeUndefined()

    session = new Session()
    session.trackOrder.push("foo")
    error = session.validateSync("trackOrder")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("trackOrder")

    session = new Session()
    session.trackOrder.push("eac4c8a2-8801-4b9b-95d7-c0788791a4e0")
    session.trackOrder.push("foo")
    error = session.validateSync("trackOrder")
    expect(error).toBeDefined()
    expect(error.errors).toHaveProperty("trackOrder")
  })

  it("should validate tracks prop", () => {
    session = new Session()
    error = session.validateSync("tracks")
    expect(error).toBeUndefined()

    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.id"]).toBeDefined()
    expect(error.errors["tracks.0.color"]).toBeDefined()
    expect(error.errors["tracks.0.instrument"]).toBeDefined()
  })

  it("should validate tracks.id prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({ id: "foo" })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.id"]).toBeDefined()

    session = new Session()
    // @ts-ignore
    session.tracks.push({ id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0" })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.id"]).toBeUndefined()
  })

  it("should validate tracks.color prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({ color: "foo" })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.color"]).toBeDefined()

    session = new Session()
    // @ts-ignore
    session.tracks.push({ color: "deepPurple" })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.color"]).toBeUndefined()
  })

  it("should validate tracks.label prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.label"]).toBeUndefined()
    expect(session.tracks[0].label).toBe("Untitled track")
  })

  it("should validate tracks.noteResolution prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.noteResolution"]).toBeUndefined()
    expect(session.tracks[0].noteResolution).toBe(1)

    session = new Session()
    // @ts-ignore
    session.tracks.push({ noteResolution: 2 })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.noteResolution"]).toBeUndefined()

    session = new Session()
    // @ts-ignore
    session.tracks.push({ noteResolution: 4 })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.noteResolution"]).toBeUndefined()

    session = new Session()
    // @ts-ignore
    session.tracks.push({ noteResolution: 5 })
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.noteResolution"]).toBeDefined()
  })

  it("should validate tracks.muted prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.muted"]).toBeUndefined()
    expect(session.tracks[0].muted).toBe(false)
  })

  it("should validate tracks.soloed prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.soloed"]).toBeUndefined()
    expect(session.tracks[0].soloed).toBe(false)
  })

  it("should validate tracks.muted prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.cells"]).toBeUndefined()
    expect(session.tracks[0].muted).toBe(false)
  })

  it("should validate tracks.cells prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.cells"]).toBeUndefined()
    expect(session.tracks[0].cells).toHaveLength(64)
    expect(session.tracks[0].cells[0]).toMatchObject({
      scheduled: false,
      midi: null,
      processing: { gain: { gain: 1 } }
    })
  })

  it("should validate tracks.processing prop", () => {
    session = new Session()
    // @ts-ignore
    session.tracks.push({})
    error = session.validateSync("tracks")
    expect(error).toBeDefined()
    expect(error.errors["tracks.0.cells"]).toBeUndefined()
    expect(session.tracks[0].processing).toMatchObject({gain: {gain: 1}})
  })

  it("should save and update a session", async () => {
    await Session.findOneAndDelete({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0"
    })

    expect.assertions(5)

    session = new Session({
      id: "eac4c8a2-8801-4b9b-95d7-c0788791a4e0",
      creatorID: "foo"
    })

    const spyOnSave = jest.spyOn(session, "save")
    await session.save()

    expect(spyOnSave).toHaveBeenCalled()
    expect(session).toMatchObject({
      id: expect.any(String),
      creatorID: expect.any(String),
      tempo: expect.any(Number),
      masterGain: expect.any(Number),
      // activeTrackID: null,
      // activeCellBeat: null,
      trackOrder: expect.any(Array),
      tracks: expect.any(Array),
      instruments: expect.any(Array),
      samples: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })

    const spyOnUpdate = jest.spyOn(session, "updateOne")

    session.trackOrder.push("55315ce5-0e27-4e4e-9fab-2766b1dae8bd")
    // @ts-ignore
    session.tracks.push({
      id: "55315ce5-0e27-4e4e-9fab-2766b1dae8bd",
      color: "pink",
      instrument: mongoose.Types.ObjectId()
    })
    session.instruments.push(mongoose.Types.ObjectId())
    session.samples.push(mongoose.Types.ObjectId())

    const result = await session.updateOne(
      { id: session.id },
      { $set: { creatorID: "bar", tempo: 180, masterGain: 0.7 } }
    )

    expect(spyOnUpdate).toHaveBeenCalled()
    expect(result.ok).toBeTruthy()

    const updatedSession = await Session.findById(session._id)
    expect(updatedSession.updatedAt.valueOf()).toBeGreaterThan(
      updatedSession.createdAt.valueOf()
    )
  })
})
