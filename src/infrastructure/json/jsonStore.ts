import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const jsonDataDirectory = path.resolve(
  process.cwd(),
  "src/extensions/json-data"
)

const ensureJsonDirectory = async (): Promise<void> => {
  await mkdir(jsonDataDirectory, { recursive: true })
}

export const readJsonFile = async <A>(fileName: string): Promise<A> => {
  await ensureJsonDirectory()

  const filePath = path.join(jsonDataDirectory, fileName)
  const fileContents = await readFile(filePath, "utf8")

  return JSON.parse(fileContents) as A
}

export const writeJsonFile = async <A>(
  fileName: string,
  value: A
): Promise<void> => {
  await ensureJsonDirectory()

  const filePath = path.join(jsonDataDirectory, fileName)

  await writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8")
}

