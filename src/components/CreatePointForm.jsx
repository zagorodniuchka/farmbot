import { useState } from 'react';

const CreatePointForm = () => {
    const [point, setPoint] = useState({ name: '', x: 0, y: 0, z: 0 });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPoint(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Created point:', point);
    };

    return (
        <div className="bg-white shadow p-4 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Create New Point</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="x" placeholder="X" onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="y" placeholder="Y" onChange={handleChange} className="border p-2 rounded" />
                <input type="number" name="z" placeholder="Z" onChange={handleChange} className="border p-2 rounded" />
                <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Create Point
                </button>
            </form>
        </div>
    );
};

export default CreatePointForm;
