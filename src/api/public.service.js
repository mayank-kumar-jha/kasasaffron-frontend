import api from './client.js';

/**
 * Fetch all active products (flavours) from the backend.
 * Falls back to AdminContext data if backend unavailable.
 */
export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

/**
 * Fetch a single product by slug.
 */
export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

/**
 * Upload an image via the backend (which uploads to Cloudinary).
 * @param {File} file - The file object from the input/drop
 * @returns {string} - The Cloudinary URL of the uploaded image
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data?.data?.url; // Returns the Cloudinary URL
};

/**
 * Fetch all events from the backend.
 */
export const getEvents = async () => {
  const { data } = await api.get('/admin/events');
  return data;
};

/**
 * Fetch site CMS content (about, history, gallery, etc.)
 */
export const getSiteContent = async (section) => {
  const { data } = await api.get(`/admin/content/${section}`);
  return data;
};

/**
 * Submit a B2B partnership inquiry
 */
export const submitB2BInquiry = async (formData) => {
  const { data } = await api.post('/b2b', formData);
  return data;
};

/**
 * Submit a contact form
 */
export const submitContact = async (formData) => {
  const { data } = await api.post('/contacts', formData);
  return data;
};
