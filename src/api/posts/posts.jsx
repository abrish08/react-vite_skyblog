import api from "..";


export const getPosts = async () => {
  const { data } = await api.get('/posts');
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post('/posts', postData);
  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData);
  return data;
};

export const deletePost = async (id) => {
  await api.delete(`/posts/${id}`);
};

export const addComment = async (postId, commentData) => {
  const { data } = await api.post(`/posts/${postId}/comments`, commentData);
  return data;
};