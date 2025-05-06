import { Link } from "@inertiajs/react";
import Modal from "./Modal";
import NavLink from "./NavLink";
import PrimaryButton from "./PrimaryButton";

export const LogOutModal: React.FC<{ show: boolean; setShowModal: (show: boolean) => any }> = ({ show, setShowModal }) => {
    return (
        <Modal show={show} maxWidth="xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 ">
                    <h2 className="text-2xl font-bold text-gray-800">Logout</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-8  items-center space-y-4">
                    <p className="text-gray-600 text-lg ">
                        Are you sure you want to log out?
                    </p>
                    <div className="flex w-full justify-end space-x-2">
                        <Link as="button" href="#" onClick={() => setShowModal(!show)} className="px-3 py-2 bg-black text-white flex items-center  hover:border-0 rounded-md">
                            Cancel
                        </Link>
                        <Link method="post" href={route('logout')} as="button" className="px-3 py-2 flex items-center text-white bg-red-700 hover:border-0 rounded-md">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
