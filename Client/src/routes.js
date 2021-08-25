import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage")
  },
  {
    path: "/currentStageGames",
    name: "currentStageGames",
    component: ()=> import("./pages/CurrentStageGames")
  },
  {
    path: "/about",
    name: "about",
    component:()=> import("./pages/AboutPage")
  },
  {
    path: "/playerPage/:player_id",
    name: "playerPage",
    component:()=> import("./pages/PlayerPage")
  },
  {
    path: "/teamPage/:team_name",
    name: "teamPageByName",
    component:()=> import("./pages/TeamPage")
  },
  {
    path: "/teamPage/:team_id",
    name: "teamPageById",
    component:()=> import("./pages/TeamPage")
  },
  {
    path:"/favoriteGames",
    name:"favoriteGamesPage",
    component:()=>import("./pages/FavoriteGamesPage")
  },
  {
    path: "/addGamesToSystem",
    name:"AddGamesToSystemPage",
    component:()=>import("./pages/AddGamesToSystemPage")
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound
  }
 
];

export default routes;
