import { processCreateSample, processSamples } from "./sample"
// tslint:disable-next-line:no-implicit-dependencies
import mockingoose from "mockingoose"
import SampleModel, { ISampleCreateInput } from "../models/sample"
import { IUpload } from "../schemas"
import { Readable } from "stream"

describe("Sample resolver", () => {
  describe("processSampleList", () => {
    beforeEach(() => {
      mockingoose.resetAll()
      jest.clearAllMocks()
    })

    it("should return an empty list", async () => {
      mockingoose(SampleModel).toReturn([])

      const result = await processSamples(SampleModel, null)

      expect(result).toHaveLength(0)
    })

    it("should return a list of samples", async () => {
      const samples = [
        {
          _id: "507f191e810c19729de860ea",
          id: "91bb1d55-b23f-433b-8232-a473e6770eab",
          url: "/samples/91bb1d55-b23f-433b-8232-a473e6770eab",
          filename: "foo.bar",
          type: "audio/bar",
          label: "baz",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "5ca4af76384306089c1c30ba",
          id: "9fecd752-fc06-448a-b745-dd1f242f4bf2",
          url: "/samples/9fecd752-fc06-448a-b745-dd1f242f4bf2",
          filename: "fiz.bar",
          type: "audio/bar",
          label: "baz",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockingoose(SampleModel).toReturn(samples)

      const result = await processSamples(SampleModel, null)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: "91bb1d55-b23f-433b-8232-a473e6770eab"
      })
      expect(result[1]).toMatchObject({
        id: "9fecd752-fc06-448a-b745-dd1f242f4bf2"
      })
    })
  })

  describe("processCreateSample", () => {
    it("should return a response containing a sample", async () => {
      // Arrange
      const file: Promise<IUpload> = Promise.resolve({
        filename: "foo.ext",
        mimetype: "audio/ext",
        encoding: "",
        createReadStream: () => new Readable()
      })
      const input: ISampleCreateInput = { file, label: "bar" }

      const mockStoreFS = (upload: IUpload) => {
        return Promise.resolve({
          id: "badd8bde-9238-4b55-b7e2-228490cf3b44",
          filePath: "/file/path",
          fileExtension: "ext"
        })
      }
      mockingoose(SampleModel).toReturn({
        _id: "507f191e810c19729de860ea",
        id: "badd8bde-9238-4b55-b7e2-228490cf3b44",
        filename: "foo.ext",
        url: "/samples/badd8bde-9238-4b55-b7e2-228490cf3b44.ext",
        type: "audio/ext",
        label: "bar",
      }, 'save')

      // Act
      const result = await processCreateSample(SampleModel, mockStoreFS, {
        input
      })

      // Assert
      expect(result.sample).toMatchObject({
        id: "badd8bde-9238-4b55-b7e2-228490cf3b44",
        filename: "foo.ext",
        url: "/samples/badd8bde-9238-4b55-b7e2-228490cf3b44.ext",
        type: "audio/ext",
        label: "bar",
        // createdAt: new Date(),
        // updatedAt: new Date()
      })
    })

    it('should throw when no file extension',() => {
      // Arrange
      const file: Promise<IUpload> = Promise.resolve({
        filename: "foo",
        mimetype: "audio/ext",
        encoding: "",
        createReadStream: () => new Readable()
      })
      const input: ISampleCreateInput = { file, label: "bar" }

      const mockStoreFS = (upload: IUpload) => {
        return Promise.resolve({
          id: "badd8bde-9238-4b55-b7e2-228490cf3b44",
          filePath: "/file/path",
          fileExtension: ""
        })
      }
      mockingoose(SampleModel).toReturn({}, 'save')

      expect.assertions(1)

      // Act
      processCreateSample(SampleModel, mockStoreFS, {
        input
      }).catch(err => {
      // Assert
        expect(err).toBeInstanceOf(Error)
      })

    })

    it('should throw when no audio MIME type',() => {
      // Arrange
      const file: Promise<IUpload> = Promise.resolve({
        filename: "foo.png",
        mimetype: "image/png",
        encoding: "",
        createReadStream: () => new Readable()
      })
      const input: ISampleCreateInput = { file, label: "bar" }

      const mockStoreFS = (upload: IUpload) => {
        return Promise.resolve({
          id: "badd8bde-9238-4b55-b7e2-228490cf3b44",
          filePath: "/file/path",
          fileExtension: "png"
        })
      }
      mockingoose(SampleModel).toReturn({}, 'save')

      expect.assertions(1)

      // Act
      processCreateSample(SampleModel, mockStoreFS, {
        input
      }).catch(err => {
        // Assert
        expect(err).toBeInstanceOf(Error)
      })
    })
  })
})
