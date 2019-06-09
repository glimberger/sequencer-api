import path from "path"
import fs from "fs"
import storeFs from "./store-fs"
import { IUpload } from "../schemas"
import { isValidUuid } from "./validators"

describe("storeFS", () => {
  const SAMPLE_DIR = path.join(__dirname, "../../test/samples")

  it("should store a file in the filesystem", async () => {
    // Arrange
    emptyAndRemove(SAMPLE_DIR)
    const readable = fs.createReadStream(
      path.join(__dirname, "../../test/sound.wav")
    )
    const upload: IUpload = {
      createReadStream: () => readable,
      encoding: "UTF-8",
      filename: "sound.wav",
      mimetype: "audio/wave"
    }

    // Act
    const result = await storeFs(SAMPLE_DIR)(upload)

    // Assert
    expect(fs.existsSync(SAMPLE_DIR))
    expect(result.id).toBeDefined()
    expect(isValidUuid(result.id)).toBe(true)
    expect(result.fileExtension).toBeDefined()
    expect(result.fileExtension).toBe("wav")
    expect(result.filePath).toBeDefined()
  })

  it('should store when file has no extension', async () => {
    // Arrange
    emptyAndRemove(SAMPLE_DIR)
    const readable = fs.createReadStream(
      path.join(__dirname, "../../test/sound.wav")
    )
    const upload: IUpload = {
      createReadStream: () => readable,
      encoding: "UTF-8",
      filename: "foo",
      mimetype: "audio/wave"
    }

    // Act
    const result = await storeFs(SAMPLE_DIR)(upload)

    // Assert
    expect(fs.existsSync(SAMPLE_DIR))
    expect(result.id).toBeDefined()
    expect(isValidUuid(result.id)).toBe(true)
    expect(result.fileExtension).toBeDefined()
    expect(result.fileExtension).toBe('')
    expect(result.filePath).toBeDefined()
  })
})

const emptyAndRemove = (directory: string) => {
  if (!fs.existsSync(directory)) {
    return
  }

  try {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      fs.unlinkSync(path.join(directory, file))
    }

    fs.rmdirSync(directory)
  } catch (e) {
    console.error(e.toString())
  }
}
