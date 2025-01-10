import axiosInstance from './axiosInstance';
//모델을 커스텀하게 될 경우 사용할 API

//모델 생성
export const createModel = async (modelName: string, trainingData: string): Promise<any> => {
    try {
      const response = await axiosInstance.post('/chat/g/create', {
        modelName,
        trainingData
      });
      return response.data;
    } catch (error) {
      console.error('모델 생성 실패:', error);
      throw error;
    }
  };
  
  //모델 삭제
  export const deleteModel = async (modelId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/chat/g/${modelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  //모델 목록 조회
  export const getCustomModels = async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/chat/all-g');  
      return response.data.CustomModels;
    } catch (error) {
      throw error;
    }
  };
   