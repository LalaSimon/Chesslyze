interface ButtonProps {
  callback?: () => void
  btnText: string
  description?: string
}

export const Button = ({ btnText, callback, description }: ButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span>{description}</span>
      <button
        onClick={callback}
        className="max-w-[150px] rounded-xl border border-gray-400 p-2 text-center transition duration-150 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-gray-100 active:shadow-inner active:shadow-gray-500">
        {btnText}
      </button>
    </div>
  )
}
