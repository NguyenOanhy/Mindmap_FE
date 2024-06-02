import React, { useState } from 'react'
import { addDataToFirestore } from "../firebase";

const Form = ( {_currentItem, onClose, place } ) => {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("Mathematics");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addDataToFirestore(name, _currentItem, tag, isPublic, place);
      console.log('Saved');
      setIsSaving(false);
      onClose();
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-gray-100 items-center justify-center">
      <form className="bg-white max-w-sm shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-center font-bold text-3xl mb-6">Save</h3>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='flex flex-col mb-4 font-sans'>
          <label htmlFor='Tag' className='text-gray-700 font-bold mb-2'>Tag</label>
          <select
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value='Mathematics'>Mathematics</option>
            <option value='History'>History</option>
            <option value='Science'>Science</option>
            <option value='Literature'>Literature</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        <div className='flex flex-col mb-4 font-sans'>
          <label className='text-gray-700 font-bold mb-2'>Public</label>
          <select
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={isPublic ? 'yes' : 'no'}
            onChange={(e) => setIsPublic(e.target.value === 'yes')}
          >
            <option value='yes'>Yes</option>
            <option value='no'>No</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#06325E] hover:bg-[#050828] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form