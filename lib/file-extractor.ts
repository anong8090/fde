// lib/file-extractor.ts
// 附件轻量化文本解析器

export interface ParsedAttachment {
  name: string;
  type: string;
  size: number;
  text: string;
}

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function parseAttachment(file: File): Promise<ParsedAttachment> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`附件“${file.name}”超过 10MB 限制`);
  }

  const name = file.name;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const size = file.size;
  const type = file.type || "application/octet-stream";

  try {
    const text = await file.text();
    return { name, type, size, text: text.slice(0, 30000) };
  } catch (err: any) {
    return {
      name,
      type,
      size,
      text: `[已扫描附件文件: ${name} (${(size / 1024).toFixed(1)} KB)]`
    };
  }
}
