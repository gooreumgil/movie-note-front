import apiClient from "@/core/apiClient";

export default {

    saveUploadFile(formData, fileType) {

        const url = `/api/v1/upload-files`;

        return apiClient.post(url, formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            params: {
                fileType
            }
        })

    },

}