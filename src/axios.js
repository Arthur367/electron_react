import axios from "axios";
import { ANOTHERS_API, API_URL, CHECK_API } from "./api";




// export function fetcher(url, params) {
//     return axiosService.get(`${url}${params}&function=TIME_SERIES_DAILY&outputsize=compact&apikey=${process.env.REACT_APP_API_KEY}`).then((res) => res.data);
// }

export function createUser(body) {
  return axios({
    url: API_URL,
    method: "POST",
    data: body
  });
}

export function signMainUser(body) {
  return axios({
    url: CHECK_API,
    method: "POST",
    data: body
  });
}

export function subUserAccess(body) {
  return axios({
    url: ANOTHERS_API,
    method: "POST",
    data: body
  });
}
