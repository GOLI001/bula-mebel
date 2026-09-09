import { handleUpload } from '@vercel/blob/client';
import { isAdminRequest } from '../server/adminSession.js';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { error: 'Method not allowed' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const isCompletionCallback = body?.type === 'blob.upload-completed';
    if (!isCompletionCallback && !isAdminRequest(request)) return json(response, 401, { error: 'Unauthorized' });
    if (!process.env.BLOB_READ_WRITE_TOKEN) return json(response, 503, { error: 'Blob storage is not configured' });

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!isAdminRequest(request)) throw new Error('Unauthorized');
        if (!/^products\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/.test(pathname)) throw new Error('Invalid pathname');
        return {
          allowedContentTypes: ['image/webp'],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async () => {}
    });
    return json(response, 200, result);
  } catch (error) {
    console.error('Image upload token error', error);
    const message = error instanceof Error && error.message === 'Unauthorized' ? 'Unauthorized' : 'Image upload could not be authorized';
    return json(response, message === 'Unauthorized' ? 401 : 500, { error: message });
  }
}
