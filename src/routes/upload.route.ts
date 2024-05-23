import { Router, type Response } from 'express'
import {
  authorizationRequired,
  authenticatedUser,
} from '../middleware/auth.middleware'
import crypto from 'node:crypto'
import multer from 'multer'
import mime from 'mime'

const router = Router()

const csvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/csv/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(8, function (err, raw) {
      if (err) cb(err, file.fieldname)

      cb(null, `${raw.toString('hex')}.${mime.getExtension(file.mimetype)}`)
    })
  },
})

const csvUpload = multer({
  storage: csvStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
})

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/img/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(8, function (err, raw) {
      if (err) cb(err, file.fieldname)

      cb(null, `${raw.toString('hex')}.${mime.getExtension(file.mimetype)}`)
    })
  },
})

const imgUpload = multer({
  storage: imgStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
})

router.post(
  '/upload-csv',
  authorizationRequired,
  csvUpload.single('csv'),
  (_, res: Response) => {
    return res.render('upload', { uploaded: true, error: '' })
  }
)

router.post(
  '/upload-img',
  authorizationRequired,
  imgUpload.array('images'),
  (_, res: Response) => {
    return res.render('upload', { uploaded: true, error: '' })
  }
)

router.get('/upload', authenticatedUser, (_, res: Response) => {
  {
    if (!res.locals?.session) return res.redirect('/')

    return res.render('upload', { uploaded: false, error: '' })
  }
})

export default router
