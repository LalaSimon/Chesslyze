import { useTypedSelector } from '../../../../../../redux/store'

export const OpeningName = () => {
  const { openingName } = useTypedSelector(state => state.openingInfo)

  return (
    <section className="flex flex-col text-center">
      <span>Opening:</span> <span>{!openingName ? '-' : openingName}</span>
    </section>
  )
}
