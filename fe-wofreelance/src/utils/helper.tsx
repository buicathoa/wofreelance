
import { excelIcon, jpgIcon, mp3Icon, mp4Icon, pdfIcon, pngIcon, svgIcon, wordIcon } from './../assets'

export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export function removeAccents(str: string) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ'
  ]
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
    var char = AccentsMap[i][0]
    str = str.replace(re, char)
  }
  return str
}

export function removeAccentsToLower(str: string) {
  return removeAccents(str).toLowerCase()
}

export const getCookie = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));

  if (cookie) {
    return decodeURIComponent(cookie.split('=')[1]);
  }

  return null;
}

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const checkLocalStorage = (key: string) => {
  if (localStorage.getItem(key) && localStorage.getItem(key) !== 'null' && localStorage.getItem(key) !== undefined) {
    return true;
  }
  return false;
}

export const renderFileIcon = (fileType: string) => {
  let icon
  switch (fileType) {
    case 'pdf':
      icon = pdfIcon;
      break;
    case 'jpg' || 'jpeg':
      icon = jpgIcon;
      break
    case  'mp3':
      icon = mp3Icon
      break
    case 'mp4':
      icon = mp4Icon
      break
    case 'xlsx':
      icon = excelIcon
      break
    case 'png':
      icon = pngIcon
      break
    case 'svg':
      icon = svgIcon
      break
    case 'docx' || 'txt':
      icon = wordIcon
      break
  }
  return icon
}

export const renderFileType = (fileType: string) => {
  switch (fileType) {
    case 'video':
      return `https://cdn2.f-cdn.com/img/profile-portfolio-video.gif?v=ce5df7fa2dcba940285f1267a3bf441a&amp;m=6&amp;buildVersion=e07b38719b740e528387bf8ddd9cf209e6a1881c`
    case 'article':
      return `https://cdn2.f-cdn.com/img/profile-portfolio-article.gif?v=051c69ab89c6ba83097ba9cd42721147&amp;m=6&amp;buildVersion=e07b38719b740e528387bf8ddd9cf209e6a1881c`
    case 'audio':
      return `https://cdn3.f-cdn.com/img/profile-portfolio-audio.gif?v=f5325ffbf3d30381a64b23afbd6afbc8&amp;m=6&amp;buildVersion=e07b38719b740e528387bf8ddd9cf209e6a1881c`
    case 'code': 
      return `https://cdn5.f-cdn.com/img/profile-portfolio-code.gif?v=7d191b1a610559904733d57294d756c2&amp;m=6&amp;buildVersion=8daf52a3ea5ccb1830cc08bb3755b66668a124d2`
    case 'others':
      return `https://cdn2.f-cdn.com/img/profile-portfolio-file.gif?v=e066efaa9edd5c74656d0da961798cda&amp;m=6&amp;buildVersion=8daf52a3ea5ccb1830cc08bb3755b66668a124d2`
  }
}


export const renderTypeOfContent = (path: string) => {
  const listImg = ['jpeg', 'png', 'gif']
  const listVideo = ['mp4', 'flv', 'avi', 'mov']
  const listAudio = ['mp3']
  const listDocs = ['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'docx', 'txt', 'pdf']
  let contentType
  if(listImg.includes(path)) {
    contentType = 'image'
  } else if(listVideo.includes('path')){
    contentType = 'video'
  } else if(listAudio.includes(path)){
    contentType = 'audio'
  } else if(listDocs.includes(path)){
    contentType = 'article'
  } else {
    contentType = 'not_allowed'
  }
  return contentType
}