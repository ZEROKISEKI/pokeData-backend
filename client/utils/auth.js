import jwtDecode from 'jwt-decode'

function verifyJWT() {
  const jwt = localStorage.getItem('jwt')
  try {
    // 使用jwt-decode不引入secret的情况下拿到decode payload
    const decoded = jwtDecode(jwt)
    return decoded.userId && decoded.username
  } catch (err) {
    return false
  }
}


export default {
  loggedIn: () => localStorage.getItem('jwt') && verifyJWT()
}