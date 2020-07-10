import apis from 'configs/apis'
import utils from 'configs/utils';
import { showLoading } from 'components/Loading/LoadingComponent';

export const uploadImage = (file) => {
        const formData = new FormData();
       
        formData.append('image', { uri:  file, type: 'image/jpeg', name: 'test.png' })

        return apis.postForm(apis.PATH.UPLOAD_IMAGE, formData)
}
