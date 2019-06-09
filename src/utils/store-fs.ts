import { IUpload } from "../schemas"
import uuid from "uuid"
import path from "path"
import fs from "fs"

/**
 * Stores an uploaded file in the filesystem.
 */
const storeFS = (sampleDir: string) => (
  file: IUpload
): Promise<{ id: string; filePath: string; fileExtension: string }> => {
  const { createReadStream, filename } = file

  const stream = createReadStream()

  const fileExtension = (filename.split(".")[1] || '').toLowerCase()

  const id = uuid.v4()

  const filePath = fileExtension
    ? path.join(sampleDir, `${id}.${fileExtension}`)
    : path.join(sampleDir, `${id}`)

  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir)
  }

  return new Promise((resolve, reject) => {
    return stream
      .on("error", error => {
        reject(error)
      })
      .pipe(fs.createWriteStream(filePath))
      .on("error", error => reject(error))
      .on("finish", () => resolve({ id, filePath, fileExtension }))
  })
}

export default storeFS
