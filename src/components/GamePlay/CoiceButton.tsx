export const ChoiceButton = ({ text, isSelected, onClick }: { text: string, isSelected: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`
        w-full p-4 mb-4 text-left text-lg font-semibold rounded-lg
        transition-all duration-300 ease-in-out
        ${isSelected
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'bg-white hover:bg-green-100 hover:scale-105'}
      `}
        >
            {text}
        </button>
    )
}