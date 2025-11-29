import locations from './korLocation.json'

export const useKorLocation = () => {
  const filteredLocations = (geoX: number, geoY: number) => {
    return locations.find(location => location.geoX === geoX && location.geoY === geoY)
  }

  return {
    filteredLocations,
  }
}
