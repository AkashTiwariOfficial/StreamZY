import multer from "multer";
 import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },

filename(req, file, cb) {
  const ext = path.extname(file.originalname)          
  const base = path.basename(file.originalname, ext)     
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const safeBase = base.replace(/\s+/g, "_")
  cb(null, `${safeBase}-${uniqueSuffix}${ext}`)            
}

})

export const upload = multer({ 
    storage,
 })