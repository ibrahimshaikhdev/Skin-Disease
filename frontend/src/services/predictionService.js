import api from './api';

export async function getModels() {
  const { data } = await api.get('/models');
  return data.models;
}

export async function predict(modelId, imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('model_id', modelId);
  const { data } = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getHistory() {
  const { data } = await api.get('/predictions');
  return data.predictions;
}

export async function getPrediction(id) {
  const { data } = await api.get(`/predictions/${id}`);
  return data;
}

export async function getHeatmap(id) {
  const { data } = await api.get(`/predictions/${id}/heatmap`);
  return data; // { heatmap: <base64 png>, label, confidence }
}

export async function getInsight(label) {
  const { data } = await api.get('/insights', { params: { label } });
  return data.insight;
}

export async function getDashboardStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}
