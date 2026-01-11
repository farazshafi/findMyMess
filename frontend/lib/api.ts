const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchMesses(area?: string) {
    const url = area ? `${API_BASE_URL}/messes?area=${area}` : `${API_BASE_URL}/messes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch messes');
    return res.json();
}

export async function fetchMessById(id: string) {
    const res = await fetch(`${API_BASE_URL}/messes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch mess details');
    return res.json();
}
