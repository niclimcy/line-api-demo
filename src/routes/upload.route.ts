import { Router, type Response, type Request } from 'express'
import {
  authorizationRequired,
  authenticatedUser,
} from '../middleware/auth.middleware'
import crypto from 'node:crypto'
import multer from 'multer'
import mime from 'mime'

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
        return res.redirect(`/upload?error=${err.message}`)
      }

      return res.redirect('/upload?uploaded=true')
    })
  }
)

router.post(
  '/upload-img',
  authorizationRequired,
  (req: Request, res: Response) => {
    imgUpload(req, res, function (err) {
      if (err) {
        return res.redirect(`/upload?error=${err.message}`)
      }

      return res.redirect('/upload?uploaded=true')
    })
  }
)

router.get('/upload', authenticatedUser, (req: Request, res: Response) => {
  {
    if (!res.locals?.session) return res.redirect('/')

    const uploaded = req.query?.uploaded ?? false
    const error = req.query?.error ?? ''

    return res.render('upload', { uploaded, error })
  }
})

export default router
