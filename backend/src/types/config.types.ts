// Define a strict interface for file metadata
export interface FileMetadata {
    name: string;
    path: string;
    extension: string;
    sizeInBytes: number;
    isFile: boolean;
    isDirectory: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastAccessedAt: Date;
}