import { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";

const LANGUAGE_MAP: Record<string, string> = {
  ".env": "bash",
  ".sh": "bash",
  ".bash": "bash",
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".json": "json",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".py": "python",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".sql": "sql",
  ".css": "css",
  ".html": "markup",
  ".xml": "markup",
  ".md": "markdown",
};

export function resolveLanguage(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (filename.startsWith(".env")) return "bash";
  return LANGUAGE_MAP[ext] ?? "bash";
}

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  readOnly?: boolean;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language,
  filename,
  readOnly = true,
  className,
  maxHeight = "max-h-[70vh]",
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const lang = language ?? (filename ? resolveLanguage(filename) : "bash");
  const theme = resolvedTheme === "dark" ? themes.nightOwl : themes.nightOwlLight;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div
      className={cn(
        "group/code relative overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {filename}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 transition-opacity group-hover/code:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      )}

      {!filename && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      )}

      <div className={cn("overflow-auto", maxHeight)}>
        <Highlight theme={theme} code={code} language={lang}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="m-0 p-0 font-mono text-sm leading-6"
              style={{ ...style, background: "transparent" }}
            >
              <code className="inline-grid w-full min-w-fit">
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <div
                      key={i}
                      {...lineProps}
                      className={cn(
                        "flex px-4",
                        readOnly && "hover:bg-muted/40",
                      )}
                    >
                      <span className="mr-4 inline-block w-8 shrink-0 select-none text-right font-mono text-xs leading-6 text-muted-foreground/50">
                        {i + 1}
                      </span>
                      <span className="flex-1">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
