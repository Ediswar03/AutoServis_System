export async function getSpk(spkId: number) {
  const response = await fetch(`/api/spk/${spkId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Gagal mengambil data SPK.');
  }

  return response.json();
}

export async function completeSpk(spkId: number) {
  const response = await fetch('/api/spk/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ spkId }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Gagal menyelesaikan SPK.');
  }

  return response.json();
}
