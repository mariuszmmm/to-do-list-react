export const IMAGE_VALIDATION_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"] as readonly string[],
  MAX_SIZE_MB: 10,
} as const;
