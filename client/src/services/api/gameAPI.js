import api from "../../axiosConfig";

export const gameAPI = {
  fetchPlaySlotsRound: async (data) => {
      const res = await api.post('/game/slots/', data);
      return res;
  },

  fetchPlayRouletteRound: async (betData) => {
    const res = await api.post('/game/roulette', betData);
    return res;
  }
}