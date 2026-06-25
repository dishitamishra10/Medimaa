"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserDropdown from "./Dropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";



const NAV_LINKS = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Medicine Form", href: "/add-medications" },
    { name: "Allergies", href: "/allergies" },
    { name: "Care Network", href: "/care-network"},
    { name: "Emergency QR", href: "/emergency_QR" }
];

export default function Navbar() {
    const pathname = usePathname();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted){
        return null;
    }


    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-14 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700/60 shadow-sm dark:shadow-black/20">
            {/* Brand */}
            <div className="flex items-center gap-1 h-full overflow-hidden">
                <Image
                    src="/MediMaa_final.png"
                    alt="MediMaa Logo"
                    width={60}
                    height={60}
                    priority
                    draggable={false}
                    className="object-contain h-17 w-17 scale-90 origin-left brightness-125 select-none"
                />
                <Image
                    src={resolvedTheme === "dark" ? "/Medimaa_text_final.png" : "/Medimaa_text_gray.png"}
                    alt="Medimaa"
                    width={120}
                    height={28}
                    priority
                    draggable={false}
                    className="object-contain h-10 w-auto brightness-125 -ml-1 select-none"
                />
            </div>

            {/* Nav Links */}
            <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={`relative px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150 select-none inline-block ${isActive
                                    ? "text-blue-600 dark:text-teal-400 bg-blue-50 dark:bg-teal-400/10"
                                    : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-blue-50 dark:hover:bg-teal-400/10"
                                    }`}
                            >
                                {link.name}

                                {isActive && (
                                    <span className="absolute -bottom-[9px] left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 dark:from-teal-400 dark:to-blue-400 rounded-t-sm" />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>


            <div>
                <ThemeToggle />
            </div>

            {/* Avatar/Dropdown */}
            <UserDropdown />
        </nav>
    );
}