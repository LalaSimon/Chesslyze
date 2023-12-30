type ButtonProps = {
  callback?: () => void
  btnText: string
  description?: string
  disabled?: boolean
}

export const Button = ({ btnText, callback, description, disabled }: ButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span>{description}</span>
      <button
        disabled={disabled ? true : false}
        onClick={callback}
        className="max-w-[150px] rounded-xl border border-gray-400 p-2 text-center transition duration-150 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-gray-100 active:shadow-inner active:shadow-gray-500 disabled:pointer-events-none disabled:opacity-35">
        {btnText}
      </button>
    </div>
  )
}
