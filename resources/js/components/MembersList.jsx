import React, { useEffect, useState } from 'react';
import MemberForm from './MemberForm';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState({});
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchMembers = async (search='') => {
    const url = 'http://localhost/accura-project/public/api/members' + (search ? `?q=${encodeURIComponent(search)}` : '');

    const res = await fetch(url);
    const data = await res.json();
    setMembers(data.data || data); // pagination or array
    setMeta({ total: data.total ?? null });
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    fetchMembers(q);
  };

  const handleSaved = (m) => {
    fetchMembers(q);
    setEditing(null);
    alert('Saved successfully');
  };

  const onSearch = (e) => {
    e.preventDefault();
    fetchMembers(q);
  };

  return (
    <div>
      <MemberForm onSaved={handleSaved} editingMember={editing} onCancel={() => setEditing(null)} />

      <form onSubmit={onSearch} className="mb-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or DS division" />
        <button>Search</button>
        <button type="button" onClick={() => { setQ(''); fetchMembers(); }}>Clear</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>First</th><th>Last</th><th>DS Division</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.first_name}</td>
              <td>{m.last_name}</td>
              <td>{m.ds_division}</td>
              <td>{m.email}</td>
              <td>
                <button onClick={() => setEditing(m)}>Edit</button>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta.total !== null && <div>Total: {meta.total}</div>}
    </div>
  );
}
