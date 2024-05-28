import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import pLimit from 'p-limit'

const limit = pLimit(10)

export function uploadImages(files: string[]): Promise<UploadApiResponse>[] {
  return files.map((fileName) =>
    limit(async () => {
      return await cloudinary.uploader.upload(fileName)
    })
  )
}
