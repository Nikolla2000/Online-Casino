import api from "../../axiosConfig";

export const rouletteAPI = {
  playRouletteRound: async (betData) => {
    const response = await api.post('/game/roulette', betData);
    return response;
  }
};