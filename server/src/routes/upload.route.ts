import { Router, type Response, type Request } from 'express'
import {
  authorizationRequired,
  authenticatedUser,
} from '../middleware/auth.middleware'
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

router.post(
  '/upload-csv',
  authorizationRequired,
  (req: Request, res: Response) => {
    csvUpload(req, res, function (err) {
      if (err) {
        return res.redirect(`/upload?error=${encodeURI(err.message)}`)
      }

      const message = encodeURI('Your file has been uploaded.')
      return res.redirect(`/upload?uploaded=${message}`)
    })
  }
)

router.post(
  '/upload-img',
  authorizationRequired,
  async (req: Request, res: Response) => {
    imgUpload(req, res, async function (err) {
      if (err || !req?.files) {
        const message = encodeURI(err.message ?? 'No file uploaded.')
        return res.redirect(`/upload?error=${message}`)
      }

      let files: string[] = []

      if (req.files instanceof Array) {
        files = req.files.map((f) => f.path)
      }

      let message = 'Your file has been uploaded.'

      if (files.length > 0) {
        const uploads = await Promise.all(uploadImages(files))
        message = uploads.map((image) => image.secure_url).join(',')
      }

      return res.redirect(`/upload?uploaded=${encodeURI(message)}`)
    })
  }
)

router.get('/upload', authenticatedUser, (req: Request, res: Response) => {
  if (!res.locals?.session) return res.redirect('/')

  let uploaded = req.query?.uploaded ?? false
  let error = req.query?.error ?? false

  if (typeof uploaded === 'string') {
    uploaded = decodeURI(uploaded)
    if (uploaded.includes('https')) {
      uploaded = uploaded.split(',')
    }
  }

  if (typeof error === 'string') {
    error = decodeURI(error)
  }

  return res.render('upload', { uploaded, error })
})

export default router
