import GamesPage from "../Pages/GamesPage/GamesPage";
import MainPage from "../Pages/MainPage/MainPage";
import RoulettePage from "../Pages/RoulettePage/RoulettePage";
import SlotsPage from "../Pages/SlotsPage/SlotsPage";

const routes = {
  main: {
    path: '/',
    element: <MainPage/>,
    name: 'main',
    includeInNav:true,
  },
  games: {
    path: '/games',
    element: <GamesPage/>,
    name: 'games',
    includeInNav: false
  },
  slots: {
    path: '/games/slots',
    element: <SlotsPage/>,
    name: 'slots',
    includeInNav:true,
  },
  roulette: {
    path: '/games/roulette',
    element: <RoulettePage/>,
    name: 'roulette',
    includeInNav:true,
  }
}

export default routes