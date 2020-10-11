import needle from 'needle';
import { readFileSync } from 'fs';

const clientId = process.env.IMGUR_CLIENTID;
const imgurApi = 'https://api.imgur.com/3';

export async function saveImage(path) {
  const response = await needle('post', `${imgurApi}/upload`, {
    image: readFileSync(path),
    type: 'file',
  }, {
    headers: {
      Authorization: `Client-ID ${clientId}`,
    },
    multipart: true,
  });
  return response.body;
}

export async function deleteImage(deleteHash) {
  const response = await needle('delete', `${imgurApi}/image/${deleteHash}`, {}, {
    headers: {
      Authorization: `Client-ID ${clientId}`,
    },
  });
  return response.body;
  // console.log(response.body);
}
