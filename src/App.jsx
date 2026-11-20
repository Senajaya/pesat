import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/items';

export default function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchItems() {
    try {
      setError('');
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Gagal memuat data item');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleAddItem(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setError('');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error('Gagal menambah item');
      setTitle('');
      setDescription('');
      await fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(item) {
    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !item.completed }),
      });
      await fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>PESAT</h1>

      <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Judul item..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="Deskripsi (opsional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 14px', cursor: 'pointer' }}>
          Tambah Item
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {loading ? (
        <p>Memuat data...</p>
      ) : items.length === 0 ? (
        <p>Belum ada item.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggle(item)}
                  />
                  <strong style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.title}
                  </strong>
                </label>
                {item.description && <p style={{ margin: '4px 0 0 24px', color: '#555' }}>{item.description}</p>}
              </div>
              <button onClick={() => handleDelete(item.id)} style={{ cursor: 'pointer' }}>
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}