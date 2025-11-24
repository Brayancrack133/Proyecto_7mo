const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../config/s3");

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        key: (req: any, file: any, cb: any) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },

    }),
});

module.exports = { upload };


