import { useState } from 'react';

export function SubmissionAvatar({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  return <span className="candidate-avatar" aria-hidden="true">
    {src && failed !== src ? <img src={src} alt="" loading="lazy" onError={() => setFailed(src)} /> : name.slice(0, 1)}
  </span>;
}
