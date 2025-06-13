import { useState } from 'react';

const MovementControls = () => {
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

    const move = (axis, delta) => {
        setPosition(prev => ({ ...prev, [axis]: prev[axis] + delta }));
    };

    return (
        <div className="bg-white shadow p-4 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Absolute Movement</h2>
            <div className="grid grid-cols-3 gap-2">
                {['x', 'y', 'z'].map(axis => (
                    <div key={axis} className="flex flex-col items-center">
                        <span className="font-medium">Axis {axis.toUpperCase()}</span>
                        <button onClick={() => move(axis, 10)} className="bg-green-500 text-white px-3 py-1 rounded my-1">+10</button>
                        <button onClick={() => move(axis, -10)} className="bg-red-500 text-white px-3 py-1 rounded">-10</button>
                        <span className="text-sm mt-1">Pos: {position[axis]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovementControls;
