export const MAX_PRODUCT_PHOTOS = 4;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function readImageFiles(files: FileList | File[], max = MAX_PRODUCT_PHOTOS): Promise<string[]> {
  const list = Array.from(files)
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, max);

  if (list.length === 0) {
    throw new Error('Please select image files (JPG, PNG, WebP, etc.)');
  }

  return Promise.all(list.map(readFileAsDataUrl));
}

export async function readVideoFile(file: File): Promise<string> {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please select a video file (MP4, WebM, etc.)');
  }
  return readFileAsDataUrl(file);
}

