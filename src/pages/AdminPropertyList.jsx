import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';
import { getAllProperties, deleteProperty } from '../utils/apiClient';
import { Trash2, Edit } from 'lucide-react';

export default function AdminPropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteState, setDeleteState] = useState({ open: false, id: null, label: '' });

  useEffect(() => {
    let mounted = true;
    getAllProperties().then(data => { if (mounted) setProperties(data); }).catch(console.error).finally(()=> mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const openDelete = (id,title) => setDeleteState({ open:true, id, label:title });
  const closeDelete = () => setDeleteState({ open:false, id:null, label:'' });

  const handleConfirmDelete = async () => {
    try {
      await deleteProperty(deleteState.id);
      setProperties(p => p.filter(x => x._id !== deleteState.id));
      closeDelete();
    } catch (err) { alert('Delete failed: ' + (err.response?.data || err.message)); }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Properties</h2>
        <Link to="/admin/add" className="px-3 py-2 bg-black text-white rounded">Add Property</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(p => (
          <div key={p._id} className="bg-white rounded shadow-sm p-4 flex flex-col">
            <div className="w-full h-40 bg-gray-100 rounded overflow-hidden mb-3 flex items-center justify-center">
              {p.images && p.images[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover"/> : <div className="text-gray-400">No Image</div>}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{p.title}</h3>
              <div className="text-sm text-gray-500">Ref: {p.refNumber || p._id}</div>
              <div className="mt-2 text-sm">{p.description?.slice(0,120)}{p.description?.length>120?'...':''}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to={`/admin/properties/${p._id}/edit`} className="p-2 rounded hover:bg-gray-100"><Edit className="w-4 h-4"/></Link>
                <button onClick={() => openDelete(p._id, p.title)} className="p-2 rounded text-red-600 hover:bg-gray-100"><Trash2 className="w-4 h-4"/></button>
              </div>
              <div className="text-sm font-medium">{p.totalPrice ? `₹ ${p.totalPrice}` : ''}</div>
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog open={deleteState.open} label={deleteState.label} onCancel={closeDelete} onConfirm={handleConfirmDelete} />
    </div>
  );
}
