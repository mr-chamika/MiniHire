export default function Alert({ show, close, type, message }: { show: boolean, close: () => void, type: 'success' | 'error', message: string }) {

    if (!show) return null;

    const styles = {
        success: {
            bgColor: 'bg-green-500',
            textColor: 'text-green-600',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            bgColor: 'bg-red-500',
            textColor: 'text-red-600',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
    };

    const currentStyle = styles[type];

    return (
        <div className={`fixed z-50 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center`}>
            <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[500px] shadow-xl border border-gray-300">
                <div className="flex flex-col items-center mb-4">
                    <div className={`w-12 h-12 ${currentStyle.bgColor} rounded-full flex items-center justify-center mb-3`}>
                        {currentStyle.icon}
                    </div>
                    <p className={`text-lg font-semibold ${currentStyle.textColor} text-center`}>{message}.</p>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={close}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )

}