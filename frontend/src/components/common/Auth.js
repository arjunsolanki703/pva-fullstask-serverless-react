import { parseJwt } from "./CONST";

function isAuthorized() {
  const token = localStorage.getItem("auth");
  if (token) {
    const jwtToken = parseJwt(token);
    if (jwtToken) {
      // <TODO> Improvise
      const curr = Math.floor(new Date().getTime() / 1000);
      const end = jwtToken.exp;
      if (curr >= end) return false;
      return true;
    }
  }
  return false;
}

export default isAuthorized;
