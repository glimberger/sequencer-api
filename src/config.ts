import path from "path"

export const PORT = process.env.PORT || 3000
export const SAMPLE_DIR = path.join(__dirname, "../static/samples")
export const SAMPLE_URL = '/samples'
export const STATIC_DIR = path.join(__dirname, "../static")

const config = {
  PORT,
  SAMPLE_DIR,
  STATIC_DIR
}

export default config