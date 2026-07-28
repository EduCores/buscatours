// Client-side image helper: converts JPG/PNG/GIF to WebP in the browser
// and uploads it to the local Vite mock (/api/upload) which writes the
// file into public/uploads/<folder>/. No original JPG/PNG is ever uploaded.

export interface WebpOptions {
  quality?: number;
  maxWidth?: number;
}

export async function fileToWebp(file: File, opts: WebpOptions = {}): Promise<File> {
  const { quality = 0.85, maxWidth = 2000 } = opts;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo crear el contexto de canvas.');
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });
  if (!blob) throw new Error('No se pudo codificar la imagen a WebP.');

  const baseName = file.name.replace(/\.[^.]+$/, '') || `imagen-${Date.now()}`;
  const safeName = baseName.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  const fileName = `${safeName}-${Date.now()}.webp`;

  return new File([blob], fileName, { type: 'image/webp' });
}

export async function uploadOptimizedImage(file: File, folder = 'tours'): Promise<string> {
  const webp = await fileToWebp(file);

  const qs = new URLSearchParams({ filename: webp.name, folder });
  const res = await fetch(`/api/upload?${qs.toString()}`, {
    method: 'POST',
    body: webp,
  });

  if (!res.ok) {
    let msg = 'Error al subir la imagen.';
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data?.url) throw new Error('Respuesta de subida inválida.');
  return data.url;
}
