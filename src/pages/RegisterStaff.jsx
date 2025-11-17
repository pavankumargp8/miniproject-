import React, {useState, useEffect} from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

export default function RegisterStaff(){
  const { staff, addStaff, updateStaff, deleteStaff } = useData()
  const { isAdmin } = useAuth()

  const empty = { facultyId:'', fullName:'', phone:'', email:'', department:'', designation:'', joinDate:'' }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(()=>{
    if(editingId){
      const s = staff.find(x=>x.id===editingId)
      if(s) setForm(s)
    } else setForm(empty)
  }, [editingId, staff])

  function upd(k,v){ setForm(s=>({...s,[k]:v})) }

  function submit(e){
    e.preventDefault()
    if(editingId){
      updateStaff(editingId, form)
      setEditingId(null)
    } else {
      addStaff(form)
    }
    setForm(empty)
  }

  function openAdd(){ setEditingId(null); setModalOpen(true) }
  function openEdit(id){ setEditingId(id); setModalOpen(true) }
  function confirmDelete(id){ setDeleteId(id) }
  function doDelete(){ if(deleteId){ deleteStaff(deleteId); setDeleteId(null) } }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">REGISTER STAFF</h2>

      <div className="bg-white p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Staff List</h3>
          {isAdmin && <button onClick={openAdd} className="bg-rose-300 px-3 py-1 rounded">+ Add Staff</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Faculty ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Designation</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s=> (
                <tr key={s.id} className="h-12">
                  <td className="border p-2">{s.facultyId}</td>
                  <td className="border p-2">{s.fullName}</td>
                  <td className="border p-2">{s.phone}</td>
                  <td className="border p-2">{s.department}</td>
                  <td className="border p-2">{s.designation}</td>
                  <td className="border p-2">
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(s.id)} className="px-2 py-1 bg-yellow-200 rounded">Edit</button>
                        <button onClick={()=>confirmDelete(s.id)} className="px-2 py-1 bg-rose-200 rounded">Delete</button>
                      </div>
                    ) : <span className="text-sm text-gray-500">—</span>}
                  </td>
                </tr>
              ))}
              {staff.length===0 && (
                <tr className="h-12"><td className="p-4" colSpan={6}>No staff members yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Staff' : 'Add Staff'} onClose={()=>{ setModalOpen(false); setEditingId(null) }}>
        <div className="p-2">
          <form onSubmit={(e)=>{ submit(e); setModalOpen(false); }} className="space-y-6">
            {/* Staff Basic Info */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                Staff Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty ID *</label>
                  <input 
                    value={form.facultyId} 
                    onChange={e=>upd('facultyId', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter faculty ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    value={form.fullName} 
                    onChange={e=>upd('fullName', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    value={form.phone} 
                    onChange={e=>upd('phone', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter phone number"
                    type="tel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    value={form.email} 
                    onChange={e=>upd('email', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Professional Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input 
                    value={form.department} 
                    onChange={e=>upd('department', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                  <input 
                    value={form.designation} 
                    onChange={e=>upd('designation', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                    placeholder="e.g., Professor, Assistant Professor"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                  <input 
                    value={form.joinDate} 
                    onChange={e=>upd('joinDate', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                    type="date"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              {isAdmin ? (
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105">
                  {editingId ? '✓ Update Staff' : '+ Register Staff'}
                </button>
              ) : (
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">Only Admin can register staff</div>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={!!deleteId} title="Confirm Delete" onClose={()=>setDeleteId(null)}>
        <div>Are you sure you want to delete this staff member?</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={()=>setDeleteId(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={()=>{ doDelete(); }} className="px-3 py-1 bg-rose-300 rounded">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
