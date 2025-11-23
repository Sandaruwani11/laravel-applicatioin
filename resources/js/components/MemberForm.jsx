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
    if (editingMember) {
      setForm({
        first_name: editingMember.first_name || '',
        last_name: editingMember.last_name?.replace(/\s*ACCURA$/,'') || '',
        ds_division: editingMember.ds_division || '',
        email: editingMember.email || ''
      });
      setErrors(null);
    } else {
      setForm({ first_name: '', last_name: '', ds_division: '', email: ''});
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
    <form onSubmit={submit} className="mb-4">
      <div>
        <label>First name</label>
        <input name="first_name" value={form.first_name} onChange={handleChange} required />
      </div>
      <div>
        <label>Last name</label>
        <input name="last_name" value={form.last_name} onChange={handleChange} required />
      </div>
      <div>
        <label>DS Division</label>
        <select name="ds_division" value={form.ds_division} onChange={handleChange} required>
          <option value="">Select</option>
          {dsOptions.map(d => (<option key={d} value={d}>{d}</option>))}
        </select>
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
      </div>

      {errors && <div className="text-red-600">{JSON.stringify(errors)}</div>}

      <button type="submit">{editingMember ? 'Update' : 'Add Member'}</button>
      {editingMember && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
