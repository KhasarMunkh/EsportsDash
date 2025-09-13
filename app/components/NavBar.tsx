"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

const nav = [
    { name: "Home", href: "/" },
    { name: "Matches", href: "/matches" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Players", href: "/players" },
    { name: "Live", href: "/live" },
];

function clsx(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

export default function Navbar() {
    const pathname = usePathname();

    const navClass = (href: string) =>
        clsx(
            "rounded-md px-3 py-2 text-sm font-medium",
            pathname === href
                ? "bg-gray-900 text-white dark:bg-gray-950/50"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
        );

    return (
        <Disclosure
            as="nav"
            className="z-50 relative bg-black/80 backdrop-blur-sm"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center px-2 lg:px-0">
                        <div className="shrink-0">
                            <Image
                                alt="Riot Games"
                                src="/riotgames.svg"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                        </div>

                        <div className="hidden lg:ml-6 lg:block">
                            <div className="flex space-x-4">
                                {nav.map((item) => (
                                    <Link key={item.href} href={item.href} className={navClass(item.href)}>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                            <input
                                name="search"
                                placeholder="Search"
                                aria-label="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:text-white focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex lg:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    <div className="hidden lg:ml-4 lg:block">
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="relative shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="size-6" />
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-4 shrink-0">
                                <MenuButton className="relative flex rounded-full text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                                >
                                    <MenuItem>
                                        <Link
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-gray-700"
                                        >
                                            Your profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-gray-700"
                                        >
                                            Settings
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-gray-700"
                                        >
                                            Sign out
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile panel */}
            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {nav.map((item) => (
                        <DisclosureButton
                            key={item.href}
                            as={Link}
                            href={item.href}
                            className={clsx(
                                "block rounded-md px-3 py-2 text-base font-medium",
                                pathname === item.href
                                    ? "bg-gray-900 text-white dark:bg-gray-950/50"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-4 pb-3">
                    <div className="flex items-center px-5">
                        <div className="shrink-0">
                            <Image
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"
                                width={40}
                                height={40}
                                className="size-10 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-white">Tom Cook</div>
                            <div className="text-sm font-medium text-gray-400">tom@example.com</div>
                        </div>
                        <button
                            type="button"
                            className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="mt-3 space-y-1 px-2">
                        <DisclosureButton
                            as={Link}
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                            Your profile
                        </DisclosureButton>
                        <DisclosureButton
                            as={Link}
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                            Settings
                        </DisclosureButton>
                        <DisclosureButton
                            as={Link}
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                            Sign out
                        </DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
