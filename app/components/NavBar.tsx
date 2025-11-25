"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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
                ? "bg-gray-900/90 text-white dark:bg-gray-900/90"
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const search = formData.get("search") as string;
                                if (search) {
                                    window.location.href = `/matches?q=${encodeURIComponent(search)}`;
                                } else {
                                    window.location.href = "/matches";
                                }
                            }}
                            className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs"
                        >
                            <input
                                name="search"
                                placeholder="Search matches..."
                                aria-label="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pr-3 pl-10 text-base text-white outline -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:text-white focus:outline-2 focus:outline-sky-400 sm:text-sm/6"
                            />
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                            />
                        </form>
                    </div>

                    <div className="flex lg:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
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
                                    ? "bg-gray-900/90 text-white dark:bg-gray-900/90"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>

            </DisclosurePanel>
        </Disclosure>
    );
}
