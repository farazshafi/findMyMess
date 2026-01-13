const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchMesses(area?: string, status: string = 'APPROVED') {
    const url = new URL(`${API_BASE_URL}/messes`);
    if (area) url.searchParams.append('area', area);
    if (status) url.searchParams.append('status', status);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch messes');
    return res.json();
}

export const fetchAllMesses = async (status?: string, adminKey?: string): Promise<any> => {
    const headers: Record<string, string> = {};
    if (adminKey) {
        headers['x-admin-key'] = adminKey;
    }

    const url = new URL(`${API_BASE_URL}/messes`);
    if (status) url.searchParams.append('status', status);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error('Failed to fetch messes');
    return res.json();
};

export async function fetchMessById(id: string) {
    const res = await fetch(`${API_BASE_URL}/messes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch mess details');
    return res.json();
}

export const createMess = async (formData: FormData, adminKey?: string): Promise<any> => {
    const headers: Record<string, string> = {};
    if (adminKey) {
        headers['x-admin-key'] = adminKey;
    }

    const res = await fetch(`${API_BASE_URL}/messes`, {
        method: 'POST',
        headers,
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit mess');
    }
    return res.json();
}

export async function fetchPendingMesses(adminKey: string) {
    const res = await fetch(`${API_BASE_URL}/messes/pending`, {
        headers: {
            'x-admin-key': adminKey
        }
    });
    if (!res.ok) throw new Error('Failed to fetch pending messes');
    return res.json();
}

export async function updateMessStatus(id: string, status: 'APPROVED' | 'REJECTED', adminKey: string) {
    const res = await fetch(`${API_BASE_URL}/messes/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey
        },
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
}

export async function deleteMess(id: string, adminKey: string) {
    const res = await fetch(`${API_BASE_URL}/messes/${id}`, {
        method: 'DELETE',
        headers: {
            'x-admin-key': adminKey
        }
    });
    if (!res.ok) throw new Error('Failed to delete mess');
    return true;
}

export const updateMess = async (id: string, formData: FormData, adminKey: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/messes/${id}`, {
        method: 'PUT',
        headers: {
            'x-admin-key': adminKey
        },
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update mess');
    }
    return res.json();
};
