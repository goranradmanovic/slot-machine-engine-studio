export interface StatusVersion {
    severity: 'success' | 'error' | 'info' | 'warn' | 'secondary' | 'contrast'
    summary: string
}

export interface FormValues {
    selectedVersion: string
}