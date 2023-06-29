import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    LoadingOutlined
} from '@ant-design/icons'
import ReactCrop from 'react-image-crop'
import { AvatarUserInterface, ResponseFormatItem, UserInterface } from '../../../interface'
import { RootState } from '../../../reducers/rootReducer';
import { openError, openSuccess } from '../../../components/Notifications';
import { getBase64 } from '../../../utils/helper';
import { UserActions } from '../../../reducers/listReducer/userReducer';
import { Spin } from 'antd';

import 'react-image-crop/dist/ReactCrop.css'
import './style.scss'
import { AppActions } from '../../../reducers/listReducer/appReducer';

export const Avatar = ({ isOpenModifyAvt, setIsOpenModifyAvt, fileUploaded, setFileUploaded }: AvatarUserInterface) => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [crop, setCrop] = useState<any>({
        unit: 'px',
        x: 10,
        y: 10,
        width: 140,
        height: 140,
        aspect: 1,
        maxWidth: 0,
        maxHeight: 0,
        isDefault: true
    })

    const antIcon = <LoadingOutlined style={{ fontSize: '1rem', color: '#1c9292' }} spin />
    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    const cropRef = useRef<any>(null)
    const isMountedRef = useRef(false)

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
        });
    };

    const uploadFiles = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(AppActions.uploadFiles({ param, resolve, reject }));
        });
    };

    const checkSize = (width: number, height: number) => {
        let size: any = {}
        const smallNumber = Math.min(width, height)
        if (smallNumber < 205) {
            size = { width: smallNumber, height: smallNumber }
        } else {
            size = { width: 205, height: 205 }
        }
        return size
    }

    const onImageLoaded = (image: any) => {
        cropRef.current = image

    }

    const onComplete = (cropp: any) => {
        const size = checkSize(cropRef.current.width, cropRef.current.height)
        const cropSize = { ...cropp, ...size, x: (cropRef.current.width - size.width) / 2, y: (cropRef.current.height - size.width) / 2 }
        getCroppedImg(cropRef.current, cropSize.isDefault ? cropSize : cropp).then((croppedImage: any) => {
            setFileUploaded({ ...fileUploaded, ...croppedImage, preview: croppedImage.url })
        });
    }

    const onCropChange = (cropPx: any) => {
        if (isMountedRef.current) {
            setCrop({ ...cropPx, isDefault: false })
        } else {
            const size = checkSize(cropRef.current.width, cropRef.current.height)
            const cropSize = { ...crop, ...size, x: (cropRef.current.width - size.width) / 2, y: (cropRef.current.height - size.width) / 2 }
            setCrop(cropSize)
            isMountedRef.current = true
        }
    }

    const getCroppedImg = (imageSrc: any, crop: any) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const scaleX = imageSrc.naturalWidth / imageSrc.width;
            const scaleY = imageSrc.naturalHeight / imageSrc.height;
            canvas.width = Math.ceil(crop.width * scaleX);
            canvas.height = Math.ceil(crop.height * scaleY);
            // canvas.width = crop.width * 2;
            // canvas.height = crop.height * 2;
            const ctx: any = canvas.getContext("2d");
            // ctx.scale(2, 2);
            const img = new Image();
            img.src = imageSrc.src
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    img,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        resolve({ blob, url });
                    }
                }, "image/jpeg");
            }
        });
    }

    const handleSetProfilePicture = () => {
        const formData = new FormData()
        formData.append('cropped_avatar', fileUploaded.blob, fileUploaded.url)
        formData.append('content_type', 'image')
        formData.append("service_type", 'cropped_avatar')
        if (fileUploaded?.file_payload) {
            formData.append("service_type", 'avatar')
            formData.append('avatar', fileUploaded.file_payload)
        }
        setIsLoading(true)
        isMountedRef.current = false
        uploadFiles(formData).then((res) => {
            updateUser({avatar_cropped: res.url![0], avatar: res.url![1]}).then(() => {
                openSuccess('Change avatar success.')
                setIsLoading(false)
                setIsOpenModifyAvt(false)
                setCrop({ ...crop, isDefault: true })
                isMountedRef.current = false
            })
        }).catch((err) => {
            openError(err.response.data.message)
        })
    }

    const onSubmitFile = async (e: any) => {
        let file = e.target.files[0]
        const base64Imgs: any = await getBase64(file)
        setFileUploaded({ ...fileUploaded, file_payload: e.target.files[0], preview: base64Imgs, base64: base64Imgs })
        isMountedRef.current = false
    }


    return (
        <div className="change-image-modal">
            <div className="change-image-modal-content">
                <div className="title">Edit Profile Picture</div>
                <div className="description">Max. of 10MB. Recommended size: 840px x 840px</div>
                <div className={`react-crop ${isLoading ? 'loading' : 'crop'}`}>
                    <ReactCrop
                        // src={fileUploaded?.base64 ? fileUploaded?.base64 : user.avatar!}
                        src={fileUploaded.base64 ?? user.avatar!}

                        crop={crop}
                        onImageLoaded={onImageLoaded}
                        onComplete={onComplete}
                        onChange={onCropChange}
                        ref={cropRef}
                        maxWidth={205}
                        maxHeight={205}
                        keepSelection={true}
                    />
                    <Spin spinning={isLoading} indicator={antIcon}>
                        <div className="div-loading">
                            <span>Proccessing your photo...</span>
                        </div>
                    </Spin>
                </div>
            </div>
            <div className={`modify-avatar-button ${isLoading && 'none'}`}>
                <div className="set-as-default" onClick={handleSetProfilePicture}>Set as Profile picture </div>
                <div className="change-picture-container">
                    <label htmlFor="upload_avatar">
                        <div className="change-picture">Change Picture</div>
                    </label>
                    <input
                        className="input-file"
                        type="file"
                        name="file"
                        id="upload_avatar"
                        onChange={(e) => onSubmitFile(e)}
                        accept={'/*'}
                        onClick={(event: any) => {
                            event.target.value = ''
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
