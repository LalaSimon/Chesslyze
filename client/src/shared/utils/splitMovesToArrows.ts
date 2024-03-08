export const splitMovesToArrows = (str: string) => {
  const length = str.length
  const halfLength = Math.floor(length / 2)
  const firstHalf = str.substring(0, halfLength)
  const secondHalf = str.substring(halfLength)
  return [firstHalf, secondHalf]
}
