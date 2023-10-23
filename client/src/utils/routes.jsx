import AdminPage from "../Pages/AdminPage/AdminPage";
import ContactPage from "../Pages/ContactPage/ContactPage";
import GamesPage from "../Pages/GamesPage/GamesPage";
import MainPage from "../Pages/MainPage/MainPage";
import RoulettePage from "../Pages/RoulettePage/RoulettePage";
import SlotsPage from "../Pages/SlotsPage/SlotsPage";

const routes = {
  main: {
    path: '/',
    element: <MainPage/>,
    name: 'home',
    includeInNav:true,
  },
  admin: {
    path: '/admin',
    element: <AdminPage/>,
    name: 'admin',
    includeInNav: true
  },
  contact: {
    path:'/contact',
    element: <ContactPage/>,
    name: 'contact',
    includeInNav: true
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
    includeInNav:false,
  },
  roulette: {
    path: '/games/roulette',
    element: <RoulettePage/>,
    name: 'roulette',
    includeInNav:false,
  }
}

export default routes