const RelativeMovement = () => {
    const steps = [1, 10, 100];
    return (
        <div className="bg-white shadow p-4 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Relative Movement</h2>
            <div className="flex gap-4">
                {steps.map(step => (
                    <button key={step} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Move +{step}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RelativeMovement;
