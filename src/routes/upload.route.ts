import { Router, type Response } from 'express'
import {
  authorizationRequired,
  authenticatedUser,
} from '../middleware/auth.middleware'
import multer from 'multer'

const router = Router()

const csvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.csv')
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

router.post(
  '/upload-csv',
  authorizationRequired,
  csvUpload.single('csv'),
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
