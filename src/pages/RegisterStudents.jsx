import React, {useState, useEffect} from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

export default function RegisterStudents(){
  const { students, addStudent, updateStudent, deleteStudent } = useData()
  const { isAdmin } = useAuth()

  const empty = { studentId:'', fullName:'', contact:'', dob:'', dept:'', year:'', session:'' }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(()=>{
    if(editingId){
      const s = students.find(x=>x.id===editingId)
      if(s) setForm(s)
    } else setForm(empty)
  }, [editingId, students])

  function upd(k,v){ setForm(s=>({...s,[k]:v})) }

  function submit(e){
    e.preventDefault()
    if(editingId){
      updateStudent(editingId, form)
      setEditingId(null)
    } else {
      addStudent(form)
    }
    setForm(empty)
  }

  function openAdd(){ setEditingId(null); setModalOpen(true) }
  function openEdit(id){ setEditingId(id); setModalOpen(true) }
  function confirmDelete(id){ setDeleteId(id) }
  function doDelete(){ if(deleteId){ deleteStudent(deleteId); setDeleteId(null) } }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">REGISTER STUDENTS</h2>

      <div className="bg-white p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Students List</h3>
          {isAdmin && <button onClick={openAdd} className="bg-rose-300 px-3 py-1 rounded">+ Add Student</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Session</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s=> (
                <tr key={s.id} className="h-12">
                  <td className="border p-2">{s.studentId}</td>
                  <td className="border p-2">{s.fullName}</td>
                  <td className="border p-2">{s.dept}</td>
                  <td className="border p-2">{s.session}</td>
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
              {students.length===0 && (
                <tr className="h-12"><td className="p-4" colSpan={5}>No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Student' : 'Add Student'} onClose={()=>{ setModalOpen(false); setEditingId(null) }}>
        <div className="p-2">
          <form onSubmit={(e)=>{ submit(e); setModalOpen(false); }} className="space-y-6">
            {/* Student Basic Info */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                  <input 
                    value={form.studentId} 
                    onChange={e=>upd('studentId', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter student ID"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input 
                    value={form.contact} 
                    onChange={e=>upd('contact', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter contact number"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input 
                    value={form.dob} 
                    onChange={e=>upd('dob', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                    placeholder="YYYY-MM-DD"
                    type="date"
                  />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Academic Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department/Course *</label>
                  <input 
                    value={form.dept} 
                    onChange={e=>upd('dept', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input 
                    value={form.year} 
                    onChange={e=>upd('year', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter academic year"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examination Session</label>
                  <input 
                    value={form.session} 
                    onChange={e=>upd('session', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition duration-200" 
                    placeholder="Enter examination session"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              {isAdmin ? (
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105">
                  {editingId ? '✓ Update Student' : '+ Register Student'}
                </button>
              ) : (
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">Only Admin can register students</div>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={!!deleteId} title="Confirm Delete" onClose={()=>setDeleteId(null)}>
        <div>Are you sure you want to delete this student?</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={()=>setDeleteId(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={()=>{ doDelete(); }} className="px-3 py-1 bg-rose-300 rounded">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
