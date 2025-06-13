import { useState } from 'react';

const MoveCommandForm = ({ bot }) => {
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoordinates((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');

        if (!bot || !bot.connected) {
            setError('�19 FarmBot not connected');
            return;
        }

        try {
            await bot.move('move_absolute', coordinates, { speed: 100 });
            setStatus(`✅ Moved to x:${coordinates.x}, y:${coordinates.y}, z:${coordinates.z}`);
        } catch (err) {
            setError(`�19 Move failed: ${err.message}`);
            console.error('�19 Move error:', err);
        }
    };

    return (
        <div className="bg-white shadow p-4 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Move FarmBot</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                    type="number"
                    name="x"
                    placeholder="X coordinate"
                    value={coordinates.x}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="y"
                    placeholder="Y coordinate"
                    value={coordinates.y}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    name="z"
                    placeholder="Z coordinate"
                    value={coordinates.z}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Start
                </button>
            </form>
            {status && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{status}</div>
            )}
            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
            )}
        </div>
    );
};

export default MoveCommandForm;