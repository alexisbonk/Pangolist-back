const multer = require('multer')
const fs = require('fs')

let storageList = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = 'upload/list'
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, 'list' + '-' + req.list.id + ext)
  }
})
export let upImgList = multer({ storage: storageList }).single('img')

let storageGift = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = 'upload/gift'
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, 'gift' + '-' + req.gift.id + ext)
  }
})
export let upImgGift = multer({ storage: storageGift }).single('img')

let storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = 'upload/user'
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    console.log(req.user.id)
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, 'user' + '-' + req.user.id + ext)
  }
})
export let upImgUser = multer({ storage: storageUser }).single('img')


export const deleteImg = (res, path) => (entity) => {
  if (entity.img) {
    if (fs.existsSync(path + entity.img)) {
      fs.unlink(path + entity.img, function (err) {
        if (err) res.status(404).send('Can\'t delete file: ' + entity.img).end()
      })
      return entity
    }
    res.status(404).send('File "' + entity.img + '" not found').end()
  }
  return entity
}

export const deleteAllImg = (res, path) => (entity) => {
  if (fs.existsSync(path)) {
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) res.status(404).send('Can\'t delete directory: ' + path).end()
    })
    return entity
  }
  return entity
}
