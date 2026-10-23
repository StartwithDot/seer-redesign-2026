import { useEffect, useState } from 'react';
import { readPreference, writePreference } from '../data/local-preferences';
import { Dialog } from './Dialog';
type Draft = {
    name: string;
    avatar: string;
    handle: string;
};
export function ProfileEditor({ address, open, onClose }: {
    address: string;
    open: boolean;
    onClose: () => void;
}) {
    const [draft, setDraft] = useState<Draft>({ name: '', avatar: '', handle: '' });
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    useEffect(() => { if (open) {
        const stored = readPreference<Partial<Draft> | null>(`deep-profile-draft:${address.toLowerCase()}`, {});
        const d = stored && typeof stored === 'object' ? stored : {};
        setDraft({ name: typeof d.name === 'string' ? d.name : '', avatar: typeof d.avatar === 'string' ? d.avatar : '', handle: typeof d.handle === 'string' ? d.handle : '' });
        setError('');
        setStatus('');
    } }, [address, open]);
    const update = (key: keyof Draft, value: string) => setDraft(d => ({ ...d, [key]: value }));
    const upload = async (file?: File) => { if (!file)
        return; if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 500 * 1024) {
        setError('Use PNG, JPEG, WebP or GIF, at most 500 KB.');
        return;
    } try {
        const value = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(); reader.readAsDataURL(file); });
        update('avatar', value);
        setError('');
    }
    catch {
        setError('The image could not be read. Try another file.');
    } };
    const submit = () => { if (draft.name.length > 32) {
        setError('Display name must be at most 32 characters.');
        return;
    } if (draft.handle && !/^[A-Za-z0-9_]{1,15}$/.test(draft.handle.replace(/^@/, ''))) {
        setError('X handle must contain 1–15 letters, numbers or underscores.');
        return;
    } if (draft.avatar && !draft.avatar.startsWith('data:image/')) {
        try {
            if (new URL(draft.avatar).protocol !== 'https:')
                throw Error();
        }
        catch {
            setError('Image URL must use HTTPS.');
            return;
        }
    } setError(''); const saved = writePreference(`deep-profile-draft:${address.toLowerCase()}`, draft); setStatus(`Signing unavailable: no verified profile signing service is configured. No signature requested and no public profile changed. Draft ${saved ? 'saved on this device' : 'kept in memory for this session'}.`); };
    return <Dialog open={open} onClose={onClose} title="Wallet profile" description="Preview your identity. Publishing requires a verified profile signing service.">
    <div className="deep-profile-editor">
      <label>Display name <input data-dialog-focus maxLength={32} value={draft.name} onChange={e => update('name', e.target.value)}/><small>{draft.name.length}/32 characters</small></label>
      <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void upload(e.dataTransfer.files[0]); }}>Avatar: choose or drop an image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => void upload(e.target.files?.[0])}/><small>PNG, JPEG, WebP or GIF · up to 500 KB</small></label>
      <label>HTTPS image URL<input type="url" value={draft.avatar.startsWith('data:') ? '' : draft.avatar} onChange={e => update('avatar', e.target.value)} placeholder="https://"/></label>
      {draft.avatar && <button className="deep-button" onClick={() => update('avatar', '')}>Remove avatar</button>}
      <label>X handle<input value={draft.handle} onChange={e => update('handle', e.target.value)} placeholder="username"/></label>
      <div className="deep-wallet-identity"><span className="deep-avatar">{draft.avatar ? <img src={draft.avatar} alt="Profile preview" onError={() => setError('The avatar could not load. Choose another image.')}/> : address.slice(2, 4)}</span><span><strong>{draft.name || address.slice(0, 10)}</strong><small>{draft.handle ? `@${draft.handle.replace(/^@/, '')}` : 'No X handle'}</small></span></div>
      {error && <p role="alert">{error}</p>}<p role="status">{status}</p>
      <div className="deep-profile__actions"><button className="deep-button" onClick={onClose}>Cancel</button><button className="deep-button deep-button--primary" onClick={submit}>Save draft</button>
        <button className="deep-button" disabled title="Profile publishing requires a verified signing and save service">Sign and save</button></div>
      <a href={`https://optimistic.etherscan.io/address/${address}`} target="_blank" rel="noreferrer">View wallet on Optimism ↗</a>
    </div>
  </Dialog>;
}
