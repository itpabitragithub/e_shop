const multer = require('multer');

const storage = multer.memoryStorage();

//Single upload
const singleUpload = multer({ storage }).single('file');

//Multiple upload
const multipleUpload = multer({ storage }).array('files',5);

module.exports = { singleUpload, multipleUpload };