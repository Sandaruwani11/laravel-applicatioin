import React, { useEffect, useState } from 'react'; 
import MemberForm from './MemberForm';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState({});
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMembers = async (search='') => {
    const url = 'http://localhost/accura-project/public/api/members' + (search ? `?q=${encodeURIComponent(search)}` : '');
    const res = await fetch(url);
    const data = await res.json();
    setMembers(data.data || data);
    setMeta({ total: data.total ?? null });
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    await fetch(`http://localhost/accura-project/public/api/members/${id}`, { method: 'DELETE' });
    fetchMembers(q);
  };

  const handleSaved = (m) => {
    fetchMembers(q);
    setEditing(null);
    setShowModal(false);
    alert('Saved successfully');
  };

  const onSearch = (e) => {
    e.preventDefault();
    fetchMembers(q);
  };

  const openModal = (member = null) => {
    setEditing(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="container py-4">

      {/* Add Member Button */}
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Add Member
      </button>

      {/* Search Form */}
      <form onSubmit={onSearch} className="d-flex mb-3 gap-2">
        <input 
          type="text"
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder="Search by name or DS division" 
          className="form-control"
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" onClick={() => { setQ(''); fetchMembers(); }} className="btn btn-secondary">
          Clear
        </button>
      </form>

      {/* Members Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>DS Division</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>{m.first_name}</td>
                <td>{m.last_name}</td>
                <td>{m.ds_division}</td>
                <td>{m.email}</td>
                <td className="d-flex gap-2">
                  <button onClick={() => openModal(m)} className="btn btn-primary btn-sm">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.total !== null && <div className="mt-2 text-muted">Total Members: {meta.total}</div>}

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Edit Member' : 'Add Member'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <MemberForm onSaved={handleSaved} editingMember={editing} onCancel={closeModal} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
