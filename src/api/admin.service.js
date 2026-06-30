import api from './client.js';

// ─── Products / Flavours ────────────────────────────────────────────────────

export const adminGetProducts = async () => {
  const { data } = await api.get('/products?all=true');
  return data;
};

export const adminCreateProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data;
};

export const adminUpdateProduct = async (id, productData) => {
  const { data } = await api.patch(`/products/${id}`, productData);
  return data;
};

export const adminDeleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ─── Image Upload ────────────────────────────────────────────────────────────

/**
 * Upload an image to Cloudinary via backend.
 * Returns the public URL of the uploaded image.
 */
export const adminUploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data?.data?.url;
};

// ─── Events ──────────────────────────────────────────────────────────────────

export const adminGetEvents = async () => {
  const { data } = await api.get('/admin/events');
  return data;
};

export const adminCreateEvent = async (eventData) => {
  const { data } = await api.post('/admin/events', eventData);
  return data;
};

export const adminUpdateEvent = async (id, eventData) => {
  const { data } = await api.put(`/admin/events/${id}`, eventData);
  return data;
};

export const adminDeleteEvent = async (id) => {
  const { data } = await api.delete(`/admin/events/${id}`);
  return data;
};

// ─── CMS Content (About, Gallery, etc.) ─────────────────────────────────────

export const adminGetContent = async (section) => {
  const { data } = await api.get(`/admin/content/${section}`);
  return data;
};

export const adminUpdateContent = async (section, contentData) => {
  const { data } = await api.put(`/admin/content/${section}`, contentData);
  return data;
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const adminGetGallery = async () => {
  const { data } = await api.get('/admin/gallery');
  return data;
};

export const adminAddGalleryImage = async (imageData) => {
  const { data } = await api.post('/admin/gallery', imageData);
  return data;
};

export const adminUpdateGalleryImage = async (id, imageData) => {
  const { data } = await api.put(`/admin/gallery/${id}`, imageData);
  return data;
};

export const adminDeleteGalleryImage = async (id) => {
  const { data } = await api.delete(`/admin/gallery/${id}`);
  return data;
};

// ─── Credentials ─────────────────────────────────────────────────────────────

export const adminUpdateCredentials = async ({ currentPassword, newEmail, newPassword }) => {
  const { data } = await api.put('/admin/credentials', { currentPassword, newEmail, newPassword });
  return data;
};

// ─── Dashboard Stats & Orders ──────────────────────────────────────────────────

export const adminGetStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const adminGetAllOrders = async () => {
  const { data } = await api.get('/admin/orders');
  return data;
};

// ─── B2B Leads ───────────────────────────────────────────────────────────────

export const adminGetB2BLeads = async () => {
  const { data } = await api.get('/b2b');
  return data;
};

export const adminUpdateB2BLeadStatus = async (id, status) => {
  const { data } = await api.patch(`/b2b/${id}/status`, { status });
  return data;
};

// ─── Contact Forms ───────────────────────────────────────────────────────────

export const adminGetContacts = async () => {
  const { data } = await api.get('/contacts');
  return data;
};

export const adminUpdateContactStatus = async (id, status) => {
  const { data } = await api.patch(`/contacts/${id}/status`, { status });
  return data;
};

// ─── Broadcast / Users ───────────────────────────────────────────────────────

export const adminGetUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const adminSendBroadcast = async (formData) => {
  const { data } = await api.post('/admin/broadcast', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const adminGetBroadcastHistory = async () => {
  const { data } = await api.get('/admin/broadcast/history');
  return data;
};
