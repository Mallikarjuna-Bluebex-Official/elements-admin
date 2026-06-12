import { useState, useEffect } from 'react';
import { useEvent } from '../context/EventContext';
import {  toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const AddEvent = () => {
    const { addEvent } = useEvent();
    const [option, setOption] = useState({ name: '', time: '', price: '', slotsLeft: '', discount: '', description: ''});
    const [isVisible, setIsVisible] = useState(true);

    const handleOptionChange = (field, value) => {
        setOption(prevOption => ({ ...prevOption, [field]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
        name: option.name,
        time: option.time,
        price: Number(option.price),
        discount: option.discount ? Number(option.discount) : 0,
        slotsLeft: Number(option.slotsLeft),
        description: option.description
    };

    try {
        await addEvent(eventData);
        // reset form
        setOption({ name: '', time: '', price: '', slotsLeft: '', discount: '', description: ''});
    } catch (error) {
        toast.error('Event not Created');
        console.error(error);
    }
};

    const handleClose = () => {
        setIsVisible(false);
        window.location.reload();
      };
    

    return (
        <div>
       {isVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-lg">
            <div className="relative max-w-150 max-h-170 mx-auto bg-white p-3 sm:p-8 rounded-2xl shadow-xl mt-0 ">
            <IoClose size={30} className="absolute right-2 top-2 cursor-pointer text-gray-600 hover:text-red-500" onClick={handleClose}/>
           <h2 className="text-2xl font-bold mb-6 text-center">Add New Event</h2>
           <form onSubmit={handleSubmit} className="space-y-4">
               <h3 className="text-lg font-semibold">Event Details: </h3>
               <div className="grid grid-cols-1 gap-4">
                   <input
                       type="text"
                       placeholder="Event Name..."
                       value={option.name}
                       onChange={(e) => handleOptionChange('name', e.target.value)}
                       className="w-full p-3 border rounded-lg"
                       required
                   />
                   <input
                       type="text"
                       placeholder="Event Time..."
                       value={option.time}
                       onChange={(e) => handleOptionChange('time', e.target.value)}
                       className="w-full p-3 border rounded-lg"
                       required
                   />
                   <input
                       type="number"
                       placeholder="Price"
                       value={option.price}
                       onChange={(e) => handleOptionChange('price', e.target.value)}
                       className="w-full p-3 border rounded-lg"
                       required
                   />
                   <div className="grid grid-cols-2 gap-4">
                       <input
                           type="number"
                           placeholder="Discount"
                           value={option.discount}
                           onChange={(e) => handleOptionChange('discount', e.target.value)}
                           className="w-full p-3 border rounded-lg"
                       />
                       <input
                           type="number"
                           placeholder="Slots Left"
                           value={option.slotsLeft}
                           onChange={(e) => handleOptionChange('slotsLeft', e.target.value)}
                           className="w-full p-3 border rounded-lg"
                           required
                       />
                   </div>
                   <textarea
                       placeholder="Description (optional)"
                       value={option.description}
                       onChange={(e) => handleOptionChange('description', e.target.value)}
                       className="w-full p-3 border rounded-lg"
                   />
               </div>
               <button type="submit" className="w-full bg-blue-500 text-white text-lg font-semibold px-4 py-3 rounded-lg hover:bg-green-600">Create Event</button>
           </form>
       </div>
       </div>
        )
       }
       </div>
    );
};

export default AddEvent;
