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
  slots: {
    path: '/slots',
    element: <SlotsPage/>,
    name: 'slots',
    includeInNav:true,
  },
  roulette: {
    path: '/roulette',
    element: <RoulettePage/>,
    name: 'roulette',
    includeInNav:true,
  }
}

export default routes