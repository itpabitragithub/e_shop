const dataUriParser = require('datauri/parser')
const path = require('path')

const parser = new dataUriParser()

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString()
    //convert the file to a data uri
    return parser.format(extName, file.buffer).content
}

module.exports = getDataUri