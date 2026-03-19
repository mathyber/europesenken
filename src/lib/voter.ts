import FingerprintJS from '@fingerprintjs/fingerprintjs';

const STORAGE_KEY = 'ev_voter_id';

function getOrCreateUUID(): string {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
}

async function getFingerprint(): Promise<string> {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    } catch {
        return 'no-fp';
    }
}

async function sha256(str: string): Promise<string> {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function getVoterToken(): Promise<string> {
    const uuid = getOrCreateUUID();
    const fingerprint = await getFingerprint();
    return sha256(uuid + fingerprint);
}
