import { createServiceSupabase } from './supabase-server';

const BUCKET = 'posts';

export async function getSignedUploadUrl(
  userId: string,
  filename: string
): Promise<{ path: string; token: string; signedUrl: string }> {
  const supa = createServiceSupabase();
  const path = `${userId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { data, error } = await supa.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(`createSignedUploadUrl: ${error?.message ?? 'unknown'}`);
  return { path, token: data.token, signedUrl: data.signedUrl };
}

export async function uploadToStorage(
  userId: string,
  file: Blob | ArrayBuffer | Buffer,
  filename: string,
  contentType: string
): Promise<{ path: string; publicUrl: string }> {
  const supa = createServiceSupabase();
  const path = `${userId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const body = file instanceof Blob ? file : new Blob([file as ArrayBuffer]);
  const { error } = await supa.storage
    .from(BUCKET)
    .upload(path, body, { contentType, upsert: false });
  if (error) throw new Error(`upload: ${error.message}`);
  const { data } = supa.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function deleteFromStorage(path: string): Promise<void> {
  const supa = createServiceSupabase();
  const { error } = await supa.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`delete: ${error.message}`);
}

export function getPublicUrl(path: string): string {
  const supa = createServiceSupabase();
  return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
