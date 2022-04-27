import {BadRequestException} from "../exception/index.js";
import crypto from "crypto";
import path from "path";

export default (key, mimeType, location, maxSize, message) => {
    return async (req, res, next) => {

        if (req.files && req.files[key] && location) {

            const file = req.files[key]

            if (file.mimetype.startsWith(mimeType) && maxSize ? file.size <= maxSize : true) {

                const fileName = crypto.randomUUID() + '-' + file.name
                const filePath = location + fileName
                const fileFullPath = path.join(path.resolve('./'), '..', filePath,)

                await req.files[key].mv(fileFullPath)

                req.body[key] = filePath

            } else {
                if (message) throw new BadRequestException(message)
            }
        }
        next()
    }
}