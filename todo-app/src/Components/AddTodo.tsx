import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { asynsThink } from '../redux/todoSlice';

const AddTodo = () => {
    const [text, setText] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const handleAdd = () => {
        if(text.trim() !== "") {
          console.log("dispaching", text);
            dispatch(asynsThink(text));
            setText("");
        }
    }

    const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === "Enter") {
        handleAdd();
      }
    }

    


  return (
    <div className='flex  items-center  justify-around mt-5 mb-5'>
      <input
       type="text" 
       value={text} 
       onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyEnter}
        
      className='w-80 h-10 bg-blue-50 border-2 border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:border-blue-500'
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  )
}

export default AddTodo
