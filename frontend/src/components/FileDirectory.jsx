import React, { useEffect, useState } from 'react';
import Popup from './popup';
import '../App.css';

const API_URL = 'https://folder-file-directory-backend.onrender.com/api/items';  // Updated URL for deployed backend

const FileDirectory = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', type: 'folder', parentId: null });
    const [expandedItems, setExpandedItems] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await fetchItems();
        setItems(data);
    };

    const fetchItems = async () => {
        const response = await fetch(API_URL);
        return response.json();
    };

    const createItem = async (data) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    const checkDuplicateName = (name, parentId) => {
        return items.some(item => item.name === name && item.parentId === parentId);
    };

    const handleCreate = async (parentId = null) => {
        if (newItem.name) {
            if (checkDuplicateName(newItem.name, parentId)) {
                alert('A file or folder with this name already exists in this directory. Please choose a different name.');
                return;
            }
            await createItem({ ...newItem, parentId });
            setNewItem({ name: '', type: 'folder', parentId: null });
            loadItems();
            setShowPopup(false); // Close popup after item creation
        }
    };

    const handleRename = async (id) => {
        const newName = prompt('Enter new name');
        if (newName) {
            if (checkDuplicateName(newName, null)) {
                alert('A file or folder with this name already exists. Please choose a different name.');
                return;
            }
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            loadItems();
        }
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadItems();
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderItems = (parentId = null) => {
        return items
            .filter(item => item.parentId === parentId)
            .map(item => (
                <li key={item._id} className="directoryItem">
                    <div className="item-header">
                        {item.type === 'folder' && (
                            <button className="expandButton" onClick={() => toggleExpand(item._id)}>
                                {expandedItems[item._id] ? '-' : '+'}
                            </button>
                        )}
                        {item.name} ({item.type})
                        <button className="rename" onClick={() => handleRename(item._id)}>Rename</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                        {item.type === 'folder' && (
                            <button onClick={() => {
                                setShowPopup(true);
                                setNewItem({ ...newItem, parentId: item._id });
                            }}>Add Inside</button>
                        )}
                    </div>
                    {item.type === 'folder' && expandedItems[item._id] && (
                        <ul className="nestedItems">{renderItems(item._id)}</ul>
                    )}
                </li>
            ));
    };

    return (
        <div className="mainContainer">
            <h1 className="mainHeading">File Directory</h1>
            <div className="innerDiv">
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
                <button onClick={() => handleCreate(newItem.parentId)}>Create</button>
            </div>
            <ul>{renderItems()}</ul>
            {showPopup && (
                <Popup 
                    onClose={() => setShowPopup(false)} 
                    onSubmit={handleCreate}
                    newItem={newItem}
                    setNewItem={setNewItem}
                />
            )}
        </div>
    );
};

export default FileDirectory;
