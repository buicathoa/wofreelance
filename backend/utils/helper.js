const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { ClientError } = require("../errors");
const path = require('path');
// const { Province, District, Ward } = require("./models/LocationModel");
// const { Province, District, Ward } = require("./models/location");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = () => {
    const storage = new CloudinaryStorage({
      cloudinary,
      allowedFormats: ["jpg", "png"],
      // params: {
      //   folder: type === "avatar" ? "wofreelance/avatar" : "wofreelance/post",
      // },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });
    return multer({
      storage: storage,
      limits: {
        fileSize: 4 * 1024 * 1024,
      },
    });
};

const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
};

const findWithMultipleQuery = (prop, queryProp, value) => {
  return value === undefined
    ? { [prop]: { $exists: true } }
    : { [prop]: { [queryProp]: value } };
};

const checkRole = (currentRole, destRole) => {
  try {
    if (currentRole === "admin") {
      if (destRole === "super_admin" || destRole === "admin") {
        throw new ClientError("You're not allowed to do this action.");
      } else {
        return true;
      }
    } else if (currentRole === "user") {
      throw new ClientError("You're not allowed to do this action.", 403);
    } else {
      return true;
    }
  } catch (err) {
    throw err;
  }
};

const returnApiGetTimeAndLocation = (ip) => {
  return `https://api.ipdata.co/${ip}?api-key=${process.env.API_IPDATA_ACCESS_KEY}`
}

const emailTemplate = (mailTo, user_id, image) => {
  return `<div className="wrapper" style="padding: 20px; background-color: #f7f7f7; border-radius: 5px;">
  <div className="logo" style="display: flex; justify-content: center;">
       <img src="https://res.cloudinary.com/dqzprqtqg/image/upload/v1682311730/root/freelancer_logo_tblwk1.jpg" />
  </div>
  <div className="container" style="padding: 20px; background-color: #ffffff; margin-top: 16px;">
      <h3>Hi ${mailTo}</h3>
      <p>We at Wofreelance.com take the trust and safety of our users seriously. We just need you to verify your email address by clicking the button below:</p><br/>
      <a href="${process.env.URL_HOST}/v1/user/email-verified?id=${user_id}" style="background-color: #0ab2a8; color: white; padding: 10px; border-radius: 10px; text-decoration: none;">Verify your email</a>
      <h3>Regards,</h3><span>The World of Freelance Team.</span>
  </div>
</div>`
}

// const genLocation = async (address_detail, province_id, district_id, ward_id) => {
//   let provinceName;
//   let districtName;
//   let wardName;
//     let province = await Province.findOne({
//       province_id: province_id,
//     });
//     if(province){
//       provinceName = province.province_name
//     }
//     let district = await District.findOne({
//       district_id: district_id,
//     });
//     if(district){
//       districtName= district.district_name
//     }
//     let ward = await Ward.findOne({ ward_id: ward_id });
//     if(ward){
//       wardName = ward.ward_name
//     }
//     return `${address_detail}, ${wardName}, ${districtName}, ${provinceName === 'Thành phố Hồ Chí Minh' ? 'TpHCM' : provinceName}`
// }

module.exports = {
  uploadImage,
  removeVietnameseTones,
  findWithMultipleQuery,
  checkRole,
  emailTemplate,
  returnApiGetTimeAndLocation,
  cloudinary
};
