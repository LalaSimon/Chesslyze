interface ButtonProps {
  text: string
  callback?: () => void
}

export const Button = ({ text, callback }: ButtonProps) => {
  return (
    <div
      onClick={callback}
      className="rounded-xl border border-gray-400 p-3 transition duration-150 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-gray-100 active:shadow-inner active:shadow-gray-500">
      {text}
    </div>
  )
}
