import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';
import { getSellerProperties, deleteProperty } from '../utils/apiClient';
import { Trash2, Edit } from 'lucide-react';

export default function SellerPropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteState, setDeleteState] = useState({ open:false, id:null, label:'' });

  useEffect(() => {
    let mounted = true;
    getSellerProperties().then(data => { if (mounted) setProperties(data); }).catch(console.error).finally(()=> mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const openDelete = (id, title) => setDeleteState({ open:true, id, label:title });
  const closeDelete = () => setDeleteState({ open:false, id:null, label:'' });

  const handleConfirmDelete = async () => {
    try {
      await deleteProperty(deleteState.id);
      setProperties(prev => prev.filter(p => p._id !== deleteState.id));
      closeDelete();
    } catch (err) { alert('Delete failed: ' + (err.response?.data || err.message)); }
  };

  if (loading) return <div>Loading your properties...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Properties</h2>
        <Link to="/seller/add" className="px-3 py-2 bg-black text-white rounded">Add Property</Link>
      </div>

      <div className="space-y-3">
        {properties.map(p => (
          <div key={p._1d} className="bg-white rounded shadow-sm p-4 flex items-center gap-4">
            <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden">
              {p.images && p.images[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" /> : <div className="text-gray-400 flex items-center justify-center h-full">No Image</div>}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{p.title}</h3>
              <div className="text-sm text-gray-500">Ref: {p.refNumber || p._id}</div>
              <div className="text-sm mt-1">{p.place}, {p.city}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/seller/properties/${p._id}/edit`} className="p-2 rounded hover:bg-gray-100"><Edit className="w-4 h-4"/></Link>
              <button onClick={() => openDelete(p._id, p.title)} className="p-2 rounded text-red-600 hover:bg-gray-100"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog open={deleteState.open} label={deleteState.label} onCancel={closeDelete} onConfirm={handleConfirmDelete} />
    </div>
  );
}
