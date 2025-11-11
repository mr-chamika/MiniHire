import React from "react";

export default function Modal({ show, setShow, children }: { show: boolean, setShow: (value: boolean) => void, children: React.ReactNode }) {

    if (!show) return null;

    return (
        <div className='fixed z-50 top-0 w-full h-full bg-black/80'>
            <div className="flex justify-end">

                <button

                    className="bg-red-400 text-white rounded-full m-2 px-2 py-0.5 border-2 hover:cursor-pointer hover:bg-red-500"
                    onClick={() => setShow(false)}
                >
                    X
                </button>

            </div>
            {children}
        </div>
    )

}