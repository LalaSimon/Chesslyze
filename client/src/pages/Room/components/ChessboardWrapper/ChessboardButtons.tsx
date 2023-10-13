import { Button } from '../../../../shared/components/Button'

interface ChessboardButtonsProps {
  clearBoard: () => void
}

export const ChessboardButtons = ({ clearBoard }: ChessboardButtonsProps) => {
  return (
    <div className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
    </div>
  )
}
