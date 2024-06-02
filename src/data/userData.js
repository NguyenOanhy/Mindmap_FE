import { getRankingOfAllUsers } from "../firebase";

const data_get = await getRankingOfAllUsers();

export const data = data_get;