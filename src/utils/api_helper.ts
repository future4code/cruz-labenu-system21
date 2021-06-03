import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

function dayjsDate(date: string): Dayjs {
  return dayjs(date, 'YYYY/MM/DD')
}

export function validDate(date: string): boolean {
  return dayjsDate(date).isValid()
}

export function dateBiggerThan(date1: string, date2: string): boolean {
  return dayjsDate(date1).isAfter(dayjsDate(date2))
}

export function validModule(module: number): boolean {
  if (isNaN(module) || module < 0 || module > 7) {
    return false
  }
  return true
}
