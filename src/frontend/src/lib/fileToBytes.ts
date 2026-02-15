export async function fileToBytes(file: File | null): Promise<Uint8Array | null> {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function bytesToImageUrl(bytes: Uint8Array): string {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}
