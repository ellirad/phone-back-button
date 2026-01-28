export interface WelcomePageProps {
    onOpenSheetA: () => void
}

export function WelcomePage({ onOpenSheetA }: WelcomePageProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Welcome to App</h1>

            <button
                onClick={onOpenSheetA}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-base font-medium rounded-md shadow-md transition-colors duration-200"
            >
                Open Bottom Sheet A
            </button>
        </div>
    )
}
