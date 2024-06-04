import { Router, type Response, type Request } from 'express'
import crypto from 'node:crypto'
import multer from 'multer'
import mime from 'mime'
import { uploadImages } from '../lib/cloudinary'

const router = Router()

const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'text/csv') {
      cb(null, './uploads/csv/')
    } else if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, './uploads/img/')
    } else {
      cb(null, './uploads/')
    }
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(8, function (err, raw) {
      if (err) cb(err, file.fieldname)

      cb(null, `${raw.toString('hex')}.${mime.getExtension(file.mimetype)}`)
    })
  },
})

const csvUpload = multer({
  storage: localStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
}).single('csv')

const imgUpload = multer({
  storage: localStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
}).array('images')

router.post('/upload-csv', (req: Request, res: Response) => {
  csvUpload(req, res, function (err) {
    if (err) {
      const message = err.message ?? 'No file uploaded.'
      return res.status(400).send({ message })
    }

    const message = 'Your file has been uploaded.'
    return res.status(200).send({ message })
  })
})

router.post('/upload-img', async (req: Request, res: Response) => {
  imgUpload(req, res, async function (err) {
    if (err || !req?.files) {
      const message = err.message ?? 'No file uploaded.'
      return res.status(400).send({ message })
    }

    let files: string[] = []

    if (req.files instanceof Array) {
      files = req.files.map((f) => f.path)
    }

    let message: string | string[] = 'Your file has been uploaded.'

    if (files.length > 0) {
      const uploads = await Promise.all(uploadImages(files))
      message = uploads.map((image) => image.secure_url)
    }

    return res.status(200).send({ message })
  })
})

export default router
