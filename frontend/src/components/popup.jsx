// frontend/src/components/Popup.jsx
import React from 'react';
import './Popup.css'

const Popup = ({ onClose, onSubmit, newItem, setNewItem }) => {
    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Create New Item</h2>
                <input 
                    type="text" 
                    placeholder="Item Name" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <select 
                    value={newItem.type} 
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                >
                    <option value="folder">Folder</option>
                    <option value="file">File</option>
                </select>
                <button onClick={() => onSubmit(newItem.parentId)}>Create</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
