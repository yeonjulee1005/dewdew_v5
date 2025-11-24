export const useQuery = () => {
  const config = useRuntimeConfig()
  const { splitByChar } = useFormatter()

  const livingIndexQuery = <T extends string, D extends number>(areaNo: D, dateTime: T) => {
    const searchParams = new URLSearchParams([
      ['areaNo', areaNo.toString()],
      ['time', dateTime],
      ['dataType', 'json'],
    ])

    return config.public.dataPortalApiKey + '&' + searchParams.toString()
  }

  const weatherQuery = <T extends string, D extends number>(date: T, time: T, nx: D, ny: D) => {
    const searchParams = new URLSearchParams([
      ['pageNo', '1'],
      ['numOfRows', '100'],
      ['dataType', 'json'],
      ['base_date', date.toString()],
      ['base_time', time.toString()],
      ['nx', splitByChar(nx, '.')?.toString() ?? ''],
      ['ny', splitByChar(ny, '.')?.toString() ?? ''],
    ])

    return config.public.dataPortalApiKey + '&' + searchParams.toString()
  }

  return {
    livingIndexQuery,
    weatherQuery,
  }
}
