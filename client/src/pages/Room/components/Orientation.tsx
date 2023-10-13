import { Button } from '../../../shared/components/Button'

interface OrientationProps {
  handleOrietnation: () => void
  changeOtherPlayerOrientation: () => void
  orientation: string
  otherPlayerOrientation: string
}

export const Orientation = ({
  handleOrietnation,
  changeOtherPlayerOrientation,
  orientation,
  otherPlayerOrientation,
}: OrientationProps) => {
  return (
    <section className="mr-2 flex flex-col gap-3">
      <Button
        callback={handleOrietnation}
        btnText={orientation === 'white' ? 'white' : 'black'}
        description={'your orientation'}
      />

      <Button
        callback={changeOtherPlayerOrientation}
        btnText={otherPlayerOrientation === 'white' ? 'white' : 'black'}
        description={'user orientation'}
      />
    </section>
  )
}
