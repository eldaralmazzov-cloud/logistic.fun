/**
 * Uploads files to Cloudinary via the backend proxy endpoint.
 * The API Key & Secret never touch the browser — they live on the server.
 * Returns only the secure_url for each uploaded file.
 */
import { useState, useCallback } from 'react';
import api from '../services/api';

export interface UploadResult {
    url: string;
    public_id: string;
    resource_type: 'image' | 'video' | 'raw';
    format: string;
    bytes: number;
}

export function useCloudinaryUpload() {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Always "configured" — the backend handles the keys
    const isConfigured = true;

    const uploadFile = useCallback(async (file: File): Promise<UploadResult | null> => {
        try {
            setUploadError(null);
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<UploadResult>('/upload/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data;
        } catch (err: any) {
            const msg =
                err?.response?.data?.detail ||
                err?.message ||
                'Upload failed. Check backend Cloudinary config.';
            setUploadError(msg);
            return null;
        }
    }, []);

    const uploadFiles = useCallback(async (
        files: FileList | File[],
        onProgress?: (done: number, total: number) => void,
    ): Promise<string[]> => {
        setUploading(true);
        const arr = Array.from(files);
        const urls: string[] = [];

        for (let i = 0; i < arr.length; i++) {
            const result = await uploadFile(arr[i]);
            if (result) urls.push(result.url);
            onProgress?.(i + 1, arr.length);
        }

        setUploading(false);
        return urls;
    }, [uploadFile]);

    return { uploadFiles, uploading, uploadError, isConfigured };
}
