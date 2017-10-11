export function formatDate(time) {
  const date = new Date(time)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export function formatTime(time) {
  const date = new Date(time)
  const hours = `${date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`}`
  const minutes = `${date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`}`
  const seconds = `${date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`}`
  return `${hours}:${minutes}:${seconds}`
}