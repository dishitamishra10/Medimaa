import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { logOut } from '@/actions/actions';

const UserDropdown = () => {
    const { user, isLoggedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Reset error state if the user object updates
    useEffect(() => {
        setImgError(false);
    }, [user]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logOut();
        router.push('/signin');
        router.refresh();
    };

    // Helper function to render avatar content or fall back cleanly to a text initial
    const renderAvatarContent = () => {
        if (user?.photoURL && !imgError) {
            return (
                <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)} // Falls back to initial if link is broken
                />
            );
        }
        return <span className="text-xl font-semibold">{user?.displayName?.charAt(0).toUpperCase() || 'U'}</span>;
    };

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Avatar / Icon Button */}
            {isLoggedIn ? (
                <div
                    onClick={() => setOpen(!open)}
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer tracking-wide hover:scale-105 transition-all duration-150 select-none overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #2DA8A8 0%, #1A6DB5 100%)",
                    }}
                >
                    {renderAvatarContent()}
                </div>
            ) : (
                <div
                    onClick={() => setOpen(!open)}
                    className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-150"
                >
                    <User size={18} />
                </div>
            )}

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-md dark:shadow-black/40 z-50 overflow-hidden">

                    {isLoggedIn ? (
                        <>
                            {/* User header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700/60">
                                <div
                                    className="w-9 h-9 rounded-full text-white flex items-center justify-center tracking-wide select-none overflow-hidden shrink-0"
                                    style={{
                                        background: "linear-gradient(135deg, #2DA8A8 0%, #1A6DB5 100%)",
                                    }}
                                >
                                    {renderAvatarContent()}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {user?.displayName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                {[
                                    { label: "Profile", path: "/profile" },
                                    { label: "Share others", path: "/invite/share-with-others" },
                                    // { label: "Settings", path: "/settings" },
                                    { label: "Help & support", path: "/help-and-support" },
                                ].map(({ label, path }) => (
                                    <button
                                        key={path}
                                        onClick={() => {
                                            router.push(path);
                                            setOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 transition-colors duration-100"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Sign out */}
                            <div className="border-t border-gray-100 dark:border-gray-700/60 py-1">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors duration-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Guest */}
                            <div className="px-4 py-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center">
                                        <User size={18} className="text-teal-600 dark:text-teal-400" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Welcome back
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Sign in to your account
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        router.push("/signin");
                                        setOpen(false);
                                    }}
                                    className="w-full border border-teal-600 dark:border-teal-500 text-teal-700 dark:text-teal-400 text-sm font-medium py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors duration-150"
                                >
                                    Login / Sign up
                                </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                                Your data is secure
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDropdown;