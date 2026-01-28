export function SheetA({ onOpenSheetB }: { onOpenSheetB: () => void }) {
    return (
        <div className="p-6 bg-white rounded-t-lg">
            <h2 className="text-xl font-semibold">Bottom Sheet A</h2>

            <p className="text-gray-600 my-3">Some content here...</p>

            <button
                onClick={onOpenSheetB}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-base font-medium rounded-md shadow-md transition-colors duration-200"
            >
                Open Bottom Sheet B
            </button>
        </div>
    )
}
