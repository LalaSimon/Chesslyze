import { useTypedSelector } from '../../../../../redux/store'

export const OpeningName = () => {
<<<<<<< HEAD
  const { opening } = useTypedSelector(state => state.opening)

  return (
    <section className="flex flex-col text-center">
      <span>Opening:</span> <span>{!opening ? '-' : opening}</span>
=======
  const { openingName } = useTypedSelector(state => state.openingInfo)

  return (
    <section className="flex flex-col text-center">
      <span>Opening:</span> <span>{!openingName ? '-' : openingName}</span>
>>>>>>> main
    </section>
  )
}
