import axios from "axios";

export const API_URL = "http://localhost:4000";

class AppServices {
  login(body) {
    return axios.post(`${API_URL}/users/` + "login", body);
  }

  updateUser(body, id) {
    console.log("The body", body);
    return axios.put(`${API_URL}/users/${id}`, body);
  }

  getCurrentUser() {
    return axios.get(`${API_URL}/users/current`);
  }

  getUsers() {
    return axios.get(`${API_URL}/users`);
  }

  register(body) {
    return axios.post(`${API_URL}/users/admin/register`, body);
  }

  deleteUser(id) {
    return axios.delete(`${API_URL}/users/${id}`);
  }
}

export default new AppServices();
