const MAX_ATTACHMENT_SIZE = 50_000_000;
const MAX_IMAGE_SIZE = 10_000_000;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);
const UNSAFE_FILE_NAME = /[\u0000-\u001f<>:"/\\|?*]/;

export function validateAttachmentFiles(files) {
  return validateFiles(files, MAX_ATTACHMENT_SIZE);
}

export function validateImageFile(file) {
  const error = validateFiles(file ? [file] : [], MAX_IMAGE_SIZE);
  if (error) {
    return error;
  }

  return IMAGE_TYPES.has(file.type) ? '' : 'Only JPEG, PNG, and GIF images are allowed.';
}

function validateFiles(files, maxSize) {
  for (const file of files || []) {
    if (!file.name || file.name.length > 255 || UNSAFE_FILE_NAME.test(file.name)) {
      return 'The file name contains unsupported characters or is too long.';
    }
    if (file.size <= 0 || file.size > maxSize) {
      return `The file must be larger than 0 bytes and no more than ${maxSize / 1_000_000} MB.`;
    }
  }

  return '';
}
