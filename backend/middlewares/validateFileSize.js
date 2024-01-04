const jwt_decode = require("jwt-decode");
const { ClientError } = require("../errors");
const db = require("../models");
const { handleError } = require("../utils/handleResponse");
const UserProfile = db.userprofile;
const UserRole = db.userroles;
const multiparty = require("multiparty");
const { cloudinary } = require("../utils/helper");

const handleFile = async (req, res, next) => {
  try {
    await import("formidable").then((formidable) => {
      const folders = ["avatar", "portfolios", "files"];
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const serviceType = fields["service_type"];
        let listUrl = [];
        const listImgPath = ["png", "jpg", "jpeg", "bmp", "tiff"];
        await new Promise((resolve, reject) => {
          serviceType?.forEach((service) => {
            files[service].forEach((element) => {
              const fileType = element.mimetype.split("/")[1];
              const fileSize = element.size / 1024 / 1024;
              const contentTypeSelected = fields["content_type"][0];
              if (err) {
                reject(new Error(err.message));
                // return handleError(res, err);
              }
              if (contentTypeSelected === "image") {
                if (
                  fileType === "jpeg" ||
                  fileType === "png" ||
                  fileType === "gif"
                ) {
                  if (fileSize > 20) {
                    reject(
                      new Error(`${element.originalFilename} is too large`)
                    );
                    // throw new Error("File is too large")
                    // reject(new Error(`${element.originalFilename} is too large`))
                    // reject(new Error(`${element.originalFilename} is too large`))
                  } else {
                    listUrl.push({
                      url: element.filepath,
                      type: fileType,
                      ...element,
                    });
                  }
                } else {
                  reject(
                    new Error(
                      `Type of ${element.originalFilename} file is not supported`
                    )
                  );
                }
              } else if (
                contentTypeSelected === "article" ||
                contentTypeSelected === "others" ||
                contentTypeSelected === "code"
              ) {
                if (fileSize > 20) {
                  reject(new Error(`${element.originalFilename} is too large`));
                } else {
                  listUrl.push({
                    url: element.filepath,
                    type: fileType,
                    ...element,
                  });
                }
              } else if (contentTypeSelected === "video") {
                if (
                  fileType === "mp4" ||
                  fileType === "flv" ||
                  fileType === "avi" ||
                  fileType === "mov"
                ) {
                  if (fileSize > 50) {
                    reject(
                      new Error(`${element.originalFilename} is too large`)
                    );
                  } else {
                    listUrl.push({
                      url: element.filepath,
                      type: fileType,
                      ...element,
                    });
                  }
                } else {
                  reject(
                    new Error(
                      `Type of ${element.originalFilename} file is not supported`
                    )
                  );
                }
              } else if (contentTypeSelected === "audio") {
                if (fileType === "mp3") {
                  if (fileSize > 20) {
                    reject(
                      new Error(`${element.originalFilename} is too large`)
                    );
                  } else {
                    listUrl.push({
                      url: element.filepath,
                      type: fileType,
                      ...element,
                    });
                  }
                } else {
                  reject(
                    new Error(
                      `Type of ${element.originalFilename} file is not supported`
                    )
                  );
                }
              } else {
                reject(
                  new Error(
                    `Type of ${element.originalFilename} file is not supported`
                  )
                );
              }
            });
            resolve();
          });
        }).catch((err) => {
          return res.status(400).json({ message: err.message });
        });
        if (listUrl.length === serviceType.length) {
          const promisesUpload = listUrl.map((file) => {
            const fileName = file.originalFilename.split('.')[0]
            return cloudinary.uploader.upload(file.url, {
              folder: serviceType.includes("cropped_avatar")
                ? "avatar"
                : folders.includes(serviceType[0])
                ? serviceType[0]
                : "",
              public_id: `/${fileName}`,
              resource_type: listImgPath.includes(file.type) ? "image" : "raw",
            });
          });
          Promise.all(promisesUpload)
            .then((result) => {
              const listUrlResponse = result.map((url) => {
                return url.url;
              });
              return res.status(200).json({ url: listUrlResponse });
            })
            .catch((err) => {
              throw new Error(err.message);
            });
        }
      });
    });
    // next()
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = handleFile;
