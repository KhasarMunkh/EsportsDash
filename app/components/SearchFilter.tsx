
import { useEffect, useMemo, useState, useRef } from "react";
import { Api } from "../utils/api.js"; // Api.searchTeams({ q, game })


export default function SearchFilter({
    game,
    selectedTeamIDs = [],
    onSelectedTeamIDsChange,           // (ids:number[]) => void
    minChars = 2,
    debounceMs = 250,
    limit = 20,
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);  // [{id,name,image_url,acronym}]
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setQuery(""); // Clear search when clicking outside
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selected = useMemo(() => new Set(selectedTeamIDs.map(Number)), [selectedTeamIDs]);

    useEffect(() => {
        const q = query.trim();
        if (q.length < minChars) { setResults([]); setErr(null); setLoading(false); return; }

        const ac = new AbortController();
        const t = setTimeout(async () => {
            setLoading(true); setErr(null);
            try {
                const data = await Api.searchTeams({ q, game, limit })
                // const res = await fetch(u.toString(), { signal: ac.signal, headers: { Accept: "application/json" } });
                // if (!res.ok) throw new Error(`Teams fetch failed ${res.status}`);
                // const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            } catch (e) {
                { setErr(e); setResults([]); }
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => { clearTimeout(t); ac.abort(); };
    }, [query, game, limit, minChars, debounceMs]);

    const toggle = (id) => {
        const n = new Set(selected);
        n.has(id) ? n.delete(id) : n.add(id);
        onSelectedTeamIDsChange?.(Array.from(n)); //notify parent
    };

    const showDropdown = dropDownOpen && query.trim().length >= minChars;

    return (
        <div ref={containerRef} className="w-full relative">
            <label htmlFor="team-search" className="sr-only">Search teams</label>
            <input
                id="team-search"
                value={query}
                onFocus={() => setDropDownOpen(true)}
                onChange={(e) => { setQuery(e.target.value); setDropDownOpen(true); }}
                placeholder="Search teams… (min 2 chars)"
                className="w-full rounded-md border px-3 py-2"
                autoComplete="off"
            />

            {showDropdown && query.trim().length >= minChars && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 
                    overflow-auto rounded-md border bg-white shadow-lg">
                    {loading && <div className="p-2 text-sm text-gray-500">Searching…</div>}
                    {err && <div className="p-2 text-sm text-red-600">Error loading teams</div>}
                    {!loading && !err && query.trim().length >= minChars && results.length === 0 && (
                        <div className="p-2 text-sm text-gray-500">No results</div>
                    )}

                    <ul className="divide-y">
                        {results.map((t) => {
                            const id = Number(t.id);
                            const isOn = selected.has(id);
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(id)}
                                        role="option"
                                        aria-selected={isOn}
                                        className={`flex w-full items-center gap-2 px-3 py-2 text-left
                                hover:bg-gray-50 ${isOn ? "bg-indigo-50" : ""}`}
                                    >
                                        {t.image_url && (
                                            <img
                                                src={t.image_url}
                                                alt=""
                                                className="h-5 w-5 rounded object-cover ring-1 ring-black/5"
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                        )}
                                        <span className="truncate">{t.name}</span>
                                        {t.acronym && <span className="ml-1 text-[11px] text-gray-500">{t.acronym}</span>}

                                        <span className={`ml-auto text-xs ${isOn ? "text-indigo-600" : "text-transparent"}`}>●</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
