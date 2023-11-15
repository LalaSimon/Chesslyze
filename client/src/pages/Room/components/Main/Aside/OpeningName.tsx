import { useTypedSelector } from '../../../../../redux/store'

export const OpeningName = () => {
  const { opening } = useTypedSelector(state => state.opening)

  return (
    <section className="flex flex-col text-center">
      <span>Opening:</span> <span>{!opening ? '-' : opening}</span>
    </section>
  )
}
