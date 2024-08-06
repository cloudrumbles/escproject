import FilterPanel from "../components/FilterPanel";

const HotelSearchNew: React.FC  = () => {
    return (
        <div className="flex flex-row h-[calc(100vh-64px)]">
            <div id="filter-panel" className="w-1/4 bg-slate-500 h-full p-4">
                <FilterPanel />
            </div>
            <div id="hotel-listings" className="w-3/4 bg-slate-400 h-full p-4">
            </div>
        </div>
    )
};

export default HotelSearchNew