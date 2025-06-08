import { Storage } from "aws-amplify";

interface FileStatusResult {
  isReady: boolean;
  lastModified?: Date;
  downloadUrl?: string;
  error?: Error;
}

export async function checkFileStatus(
  key: string,
  since?: Date
): Promise<FileStatusResult> {
  try {
    // Get file metadata using Storage.list()
    const result = await Storage.list(key, {
      level: "public", // or 'public'/'protected'
      pageSize: 1,
    });

    if (result.results.length === 0) {
      return { isReady: false };
    }

    const item = result.results[0];

    // Handle case where lastModified might be undefined
    if (!item.lastModified) {
      return {
        isReady: false,
        error: new Error("File exists but has no lastModified date"),
      };
    }

    // Check if file was modified after our reference date
    const isReady = since ? item.lastModified > since : true;

    if (isReady) {
      const downloadUrl = await Storage.get(key, {
        download: false,
        expires: 3600, // 1 hour expiration
      });

      return {
        isReady: true,
        lastModified: item.lastModified,
        downloadUrl: downloadUrl as string,
      };
    }

    return {
      isReady: false,
      lastModified: item.lastModified,
    };
  } catch (error) {
    return {
      isReady: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
