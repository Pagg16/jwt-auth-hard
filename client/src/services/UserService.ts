import api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUsers";

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>("/users");
  }
}
