import { useState } from "react";
import { encodeToUrl, copyToClipboard } from "../../utils/shareUrl";

function ShareButton({ pattern, flags, testString, replaceValue }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = encodeToUrl(pattern, flags, testString, replaceValue);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      // URL도 주소표시줄에 반영
      window.history.replaceState(
        null,
        "",
        url.split(window.location.origin)[1],
      );
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!pattern) return null;

  return (
    <button
      onClick={handleShare}
      className={`
        px-3 py-1.5 rounded-lg text-xs transition-all duration-200
        ${
          copied
            ? "bg-emerald-500/20 text-emerald-400"
            : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        }
      `}
    >
      {copied ? "✅ 복사됨!" : "🔗 공유"}
    </button>
  );
}

export default ShareButton;
