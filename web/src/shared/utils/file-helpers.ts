import type { FileCategory } from "@/shared/types";

const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".rs", ".java",
  ".c", ".cpp", ".h", ".cs", ".php", ".swift", ".kt", ".lua", ".sh",
]);

const CERTIFICATE_EXTENSIONS = new Set([
  ".pem", ".crt", ".key", ".cer", ".p12", ".pfx", ".cert", ".ca-bundle",
]);

const CONFIG_EXTENSIONS = new Set([
  ".json", ".yml", ".yaml", ".xml", ".toml", ".ini", ".cfg",
]);

export function getFileCategory(filename: string): FileCategory {
  if (filename.startsWith(".env")) return "env";

  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx === -1) return "other";

  const ext = filename.slice(dotIdx).toLowerCase();
  if (CODE_EXTENSIONS.has(ext)) return "code";
  if (CERTIFICATE_EXTENSIONS.has(ext)) return "certificate";
  if (CONFIG_EXTENSIONS.has(ext)) return "config";
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`;
}

export function isEditableFile(filename: string): boolean {
  const category = getFileCategory(filename);
  return category !== "other";
}

export function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
