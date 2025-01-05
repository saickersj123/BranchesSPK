import axiosInstance from './axiosInstance';

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
  
  export const deleteModel = async (modelId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/chat/g/${modelId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getCustomModels = async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/chat/all-g');  
      return response.data.CustomModels;
    } catch (error) {
      throw error;
    }
  };
   