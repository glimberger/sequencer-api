// tslint:disable-next-line:no-implicit-dependencies
import mockingoose from "mockingoose"
import Sample from "../models/sample"
import Instrument from "../models/instrument"
import { processInstrumentList } from "./instrument"

describe("Instrument resolver", () => {
  describe("processInstrumentList", () => {
    beforeEach(() => {
      mockingoose.resetAll()
      jest.clearAllMocks()
    })

    it("should return an empty list", async () => {
      // Arrange
      mockingoose(Instrument).toReturn([])

      // Act
      const result = await processInstrumentList(Instrument, null, null)

      // Assert
      expect(result).toHaveLength(0)
    })

    it("should return a list of instruments", async () => {
      // Arrange
      const sample = {
        _id: "507f191e810c19729de860ea",
        id: "91bb1d55-b23f-433b-8232-a473e6770eab",
        url: "/samples/91bb1d55-b23f-433b-8232-a473e6770eab",
        filename: "foo.bar",
        type: "audio/bar",
        label: "baz",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockingoose(Sample).toReturn(sample, "findOne")

      const instruments = [
        {
          _id: "507f191e810c19729de860ea",
          id: "91bb1d55-b23f-433b-8232-a473e6770eab",
          label: "Instrument 1",
          group: "Group",
          samples: [sample],
          mapping: [
            {
              note: 69,
              sample,
              detune: 0
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "5ca4af76384306089c1c30ba",
          id: "9fecd752-fc06-448a-b745-dd1f242f4bf2",
          label: "Instrument 2",
          group: "Group",
          samples: [sample],
          mapping: [
            {
              note: 69,
              sample,
              detune: 0
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockingoose(Instrument).toReturn(instruments)

      // Act
      const result = await processInstrumentList(Instrument, null, null)

      // Assert
      expect(result).toHaveLength(2)
    })
  })
})
