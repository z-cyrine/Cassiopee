export const ImportConfig = {
  UPLOAD_DIR: './uploads',
  SUPPORTED_FILE_TYPES: ['.xlsx', '.xls'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
}; 