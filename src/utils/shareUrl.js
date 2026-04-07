export function encodeToUrl(pattern, flags, testString, replaceValue) {
  const params = new URLSearchParams();
  if (pattern) params.set("r", pattern);
  if (flags) params.set("f", flags);
  if (testString) params.set("t", testString);
  if (replaceValue) params.set("rp", replaceValue);

  const base = window.location.origin + window.location.pathname;
  return `${base}?${params.toString()}`;
}

export function decodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const pattern = params.get("r") || "";
  const flags = params.get("f") || "";
  const testString = params.get("t") || "";
  const replaceValue = params.get("rp") || "";

  if (!pattern && !testString) return null;

  return { pattern, flags, testString, replaceValue };
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}
