import apis from 'configs/apis'
import utils from 'configs/utils';
import { showLoading } from 'library/Loading/LoadingComponent';

export const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
       
        formData.append('image', { uri: 'file://' + file, type: 'image/jpeg', name: 'test.png' })

        return apis.postForm(apis.PATH.UPLOAD_IMAGE, formData)

    })

}
