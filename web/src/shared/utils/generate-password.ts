const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";

export function generatePassword(length = 48): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => CHARSET[v % CHARSET.length]).join("");
}
