import { useState } from 'react';

const Peripherals = () => {
    const [state, setState] = useState(false);

    return (
        <div className="bg-white shadow p-4 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Peripherals</h2>
            <div className="flex items-center justify-between">
                <span className="text-gray-700">LED</span>
                <button
                    onClick={() => setState(prev => !prev)}
                    className={`px-4 py-2 rounded text-white ${state ? 'bg-green-600' : 'bg-gray-500'}`}
                >
                    {state ? 'On' : 'Off'}
                </button>
            </div>
        </div>
    );
};

export default Peripherals;
