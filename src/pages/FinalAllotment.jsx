import React, {useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import Modal from '../components/Modal'

export default function FinalAllotment(){
  const { isAdmin } = useAuth()
  const { students, exams, rooms } = useData()
  
  // State for totals (admin editable)
  const [totalStudentsAlloted, setTotalStudentsAlloted] = useState(() => {
    const saved = localStorage.getItem('totalStudentsAlloted')
    return saved ? parseInt(saved, 10) : 0
  })
  const [totalRoomsUsed, setTotalRoomsUsed] = useState(() => {
    const saved = localStorage.getItem('totalRoomsUsed')
    return saved ? parseInt(saved, 10) : 0
  })

  // State for allotments (seat assignments)
  const [allotments, setAllotments] = useState(() => {
    try {
      const saved = localStorage.getItem('seatAllotments')
      return saved ? JSON.parse(saved) : []
    } catch(e) { return [] }
  })

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [examFilter, setExamFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  
  // Form state for allotment
  const emptyForm = { studentId:'', studentName:'', course:'', examination:'', roomNo:'', seatNo:'' }
  const [form, setForm] = useState(emptyForm)

  // Persist totals and allotments
  useEffect(() => { localStorage.setItem('totalStudentsAlloted', String(totalStudentsAlloted)) }, [totalStudentsAlloted])
  useEffect(() => { localStorage.setItem('totalRoomsUsed', String(totalRoomsUsed)) }, [totalRoomsUsed])
  useEffect(() => { localStorage.setItem('seatAllotments', JSON.stringify(allotments)) }, [allotments])

  // Auto-calculate totals from allotments
  useEffect(() => {
    if(allotments.length > 0) {
      setTotalStudentsAlloted(allotments.length)
      const uniqueRooms = new Set(allotments.map(a => a.roomNo).filter(r => r))
      setTotalRoomsUsed(uniqueRooms.size)
    }
  }, [allotments])

  // Form handlers
  useEffect(()=>{
    if(editingId){
      const a = allotments.find(x=>x.id===editingId)
      if(a) setForm(a)
    } else setForm(emptyForm)
  }, [editingId, allotments])

  function upd(k,v){ setForm(s=>({...s,[k]:v})) }

  function openAdd(){ setEditingId(null); setModalOpen(true) }
  function openEdit(id){ setEditingId(id); setModalOpen(true) }
  function confirmDelete(id){ setDeleteId(id) }

  function submitForm(e){
    e.preventDefault()
    if(editingId){
      setAllotments(list => list.map(x => x.id === editingId ? {...x, ...form} : x))
    } else {
      setAllotments(list => [...list, {...form, id: Date.now().toString()}])
    }
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function doDelete(){
    if(deleteId){
      setAllotments(list => list.filter(x => x.id !== deleteId))
      setDeleteId(null)
    }
  }

  // Filter allotments based on search and filters
  const filteredAllotments = allotments.filter(a => {
    const matchesSearch = !searchTerm || 
      a.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCourse = !courseFilter || a.course?.includes(courseFilter)
    const matchesExam = !examFilter || a.examination?.includes(examFilter)
    const matchesRoom = !roomFilter || a.roomNo?.includes(roomFilter)
    
    return matchesSearch && matchesCourse && matchesExam && matchesRoom
  })

  // Get unique values for filter dropdowns
  const uniqueCourses = [...new Set(allotments.map(a => a.course).filter(c => c))]
  const uniqueExams = [...new Set(allotments.map(a => a.examination).filter(e => e))]
  const uniqueRooms = [...new Set(allotments.map(a => a.roomNo).filter(r => r))]

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">FINAL SEAT ALLOTMENT</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">TOTAL STUDENTS ALLOTED</div>
          {isAdmin ? (
            <input type="number" value={totalStudentsAlloted} onChange={e=>setTotalStudentsAlloted(Number(e.target.value))} className="input w-32" />
          ) : (
            <div className="text-2xl font-semibold">{totalStudentsAlloted}</div>
          )}
        </div>
        
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">TOTAL ROOMS USED</div>
          {isAdmin ? (
            <input type="number" value={totalRoomsUsed} onChange={e=>setTotalRoomsUsed(Number(e.target.value))} className="input w-32" />
          ) : (
            <div className="text-2xl font-semibold">{totalRoomsUsed}</div>
          )}
        </div>
      </div>

      <div className="bg-gray-200 p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 mb-3">
          <input 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
            placeholder="Search By Student Name Or Id" 
            className="input" 
          />
          <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} className="input">
            <option value="">All Courses</option>
            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={examFilter} onChange={e=>setExamFilter(e.target.value)} className="input">
            <option value="">All Exams</option>
            {uniqueExams.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={roomFilter} onChange={e=>setRoomFilter(e.target.value)} className="input">
            <option value="">All Rooms</option>
            {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        
        {isAdmin && (
          <div className="flex justify-end">
            <button onClick={openAdd} className="bg-rose-300 px-4 py-2 rounded">+ Add Allotment</button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Student Id</th>
              <th className="border p-3">Student Name</th>
              <th className="border p-3">Course</th>
              <th className="border p-3">Examination</th>
              <th className="border p-3">Room No</th>
              <th className="border p-3">Seat No</th>
              {isAdmin && <th className="border p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAllotments.length === 0 && (
              <tr className="h-12">
                <td className="border p-4 text-center text-gray-500" colSpan={isAdmin ? 7 : 6}>
                  {allotments.length === 0 ? 'No allotments yet' : 'No matching allotments found'}
                </td>
              </tr>
            )}
            {filteredAllotments.map(a => (
              <tr key={a.id} className="h-12 hover:bg-gray-50">
                <td className="border p-2">{a.studentId}</td>
                <td className="border p-2">{a.studentName}</td>
                <td className="border p-2">{a.course}</td>
                <td className="border p-2">{a.examination}</td>
                <td className="border p-2">{a.roomNo}</td>
                <td className="border p-2">{a.seatNo}</td>
                {isAdmin && (
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(a.id)} className="px-2 py-1 bg-yellow-200 rounded text-sm">Edit</button>
                      <button onClick={()=>confirmDelete(a.id)} className="px-2 py-1 bg-rose-200 rounded text-sm">Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Allotment' : 'Add Allotment'} onClose={()=>{ setModalOpen(false); setEditingId(null) }}>
        <form onSubmit={submitForm} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Student ID</label>
            <input value={form.studentId} onChange={e=>upd('studentId', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-2">Student Name</label>
            <input value={form.studentName} onChange={e=>upd('studentName', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-2">Course</label>
            <input value={form.course} onChange={e=>upd('course', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-2">Examination</label>
            <input value={form.examination} onChange={e=>upd('examination', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-2">Room No</label>
            <input value={form.roomNo} onChange={e=>upd('roomNo', e.target.value)} className="input" />
          </div>
          <div>
            <label className="block mb-2">Seat No</label>
            <input value={form.seatNo} onChange={e=>upd('seatNo', e.target.value)} className="input" />
          </div>
          <div className="col-span-2 text-right">
            <button className="bg-rose-300 px-4 py-2 rounded">
              {editingId ? 'Update Allotment' : 'Add Allotment'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} title="Confirm Delete" onClose={()=>setDeleteId(null)}>
        <div>Are you sure you want to delete this seat allotment?</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={()=>setDeleteId(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={doDelete} className="px-3 py-1 bg-rose-300 rounded">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
