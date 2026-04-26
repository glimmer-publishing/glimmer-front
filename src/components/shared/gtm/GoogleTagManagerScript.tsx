import { GoogleTagManager } from "@next/third-parties/google";

interface GoogleTagManagerScriptProps {
  gtmId: string;
}

export default function GoogleTagManagerScript({
  gtmId,
}: GoogleTagManagerScriptProps) {
  return <GoogleTagManager gtmId={gtmId} />;
}
