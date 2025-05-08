import axios, { AxiosError } from 'axios';
import { Result, ResultAsync, fromThrowable } from 'neverthrow';

type DownloadError = {
  type: 'FETCH_ERROR' | 'BLOB_ERROR' | 'DOWNLOAD_ERROR';
  message: string;
};

export const fetchBlobfile = (url: string): ResultAsync<Blob, DownloadError> =>
  ResultAsync.fromPromise(
    axios.get(url, { responseType: 'blob' }).then((response) => response.data),
    (error) => ({
      type: 'FETCH_ERROR',
      message:
        error instanceof AxiosError ? error.message : 'Failed to fetch PDF',
    }),
  );

export const createBlobUrl = (blob: Blob): Result<string, DownloadError> => {
  const createUrl = (b: Blob) => window.URL.createObjectURL(new Blob([b]));

  return fromThrowable(
    () => createUrl(blob),
    () => ({
      type: 'BLOB_ERROR' as const,
      message: 'Failed to create blob URL',
    }),
  )();
};

export const downloadFile = (
  url: string,
  filename: string,
): Result<void, DownloadError> => {
  const download = () => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return fromThrowable(download, () => ({
    type: 'DOWNLOAD_ERROR' as const,
    message: 'Failed to download file',
  }))();
};
