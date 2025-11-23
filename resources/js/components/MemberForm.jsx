import React, { useState, useEffect } from 'react';

export default function MemberForm({ onSaved, editingMember, onCancel }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    ds_division: '',
    email: ''
  });
  const [errors, setErrors] = useState(null);
  const dsOptions = ['Colombo 1', 'Colombo 2', 'Colombo 3'];

  useEffect(() => {
  if (!editingMember) {
    setForm({ first_name: '', last_name: '', ds_division: '', email: '' });
    setErrors(null);
  } else {
    setForm({
      first_name: editingMember.first_name || '',
      last_name: editingMember.last_name?.replace(/\s*ACCURA$/,'') || '',
      ds_division: editingMember.ds_division || '',
      email: editingMember.email || ''
    });
    setErrors(null);
  }
}, [editingMember]);


  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const submit = async (e) => {
    e.preventDefault();
    const url = editingMember 
      ? `http://localhost/accura-project/public/api/members/${editingMember.id}`
      : 'http://localhost/accura-project/public/api/members';
    const method = editingMember ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { general: data.message || 'Validation error' });
      } else {
        onSaved(data.member || data);
        setForm({ first_name: '', last_name: '', ds_division: '', email: '' });
      }
    } catch (err) {
      setErrors({ general: 'Network error' });
    }
  };

  return (
    <form onSubmit={submit} className="card p-4 mb-4 shadow-sm mx-auto" style={{maxWidth: '600px'}}>
      <h2 className="card-title mb-3">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>

      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input 
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input 
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">DS Division</label>
        <select
          name="ds_division"
          value={form.ds_division}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="">Select Division</option>
          {dsOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input 
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="form-control"
        />
      </div>

      {errors && <div className="alert alert-danger">{JSON.stringify(errors)}</div>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {editingMember ? 'Update' : 'Add Member'}
        </button>
        {editingMember && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
