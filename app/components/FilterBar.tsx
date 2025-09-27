
import { ChevronDownIcon } from '@heroicons/react/16/solid'

export default function FilterBar() {
    return (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div>
                <label htmlFor="game" className="block text-sm/6 font-medium text-gray-900">
                    Game
                </label>
                <div className="mt-2 grid grid-cols-1">
                    <select
                        id="game"
                        name="game"
                        className="col-start-1 row-start-1 w-full 
                                appearance-none rounded-md bg-white 
                                py-1.5 pr-8 pl-3 text-base text-gray-900 
                                outline-1 -outline-offset-1 outline-gray-300 
                                focus-visible:outline-2 focus-visible:-outline-offset-2 
                                focus-visible:outline-indigo-600 sm:text-sm/6"
                    >
                        <option value="lol">League of Legends</option>
                        <option value="valorant">Valorant</option>
                        <option value="cs2">CS2</option>
                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 
                                    mr-2 size-5 
                                    self-center justify-self-end 
                                    text-gray-500 sm:size-4"
                    />
                </div>
            </div>
            {/* Team search (multi-select) */}
            <div className="w-2.5 max-w-64  flex-1 ">
                <label className="mb-1 block text-xs text-gray-500">Teams</label>
            </div>
        </div>
    )
}
