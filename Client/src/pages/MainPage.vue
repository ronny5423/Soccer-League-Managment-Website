<template>
  <div style="color:darkgrey">
    <h1 style="text-align:center" >Main Page</h1>
    
    <div class="leftScreen screen">
      <LeagueInfo @finishLoading="changeLoading" :show="loadingNextGame && !firstLoading"></LeagueInfo>
    </div>
    <div class="rightScreen screen" v-if="!loadingFavoriteGames && loadingNextGame">
    <LoginPage  v-if="!$root.store.username" @successful=getFavoriteGames></LoginPage>
    <div v-else>
    <div v-if="favoriteGames">
      <h2> Favorite Games</h2>
    <FavoriteGames :games="favoriteGames"></FavoriteGames>
    </div>
    <label style="font-size:30px; font-weight:bold" v-else-if="loadingFavoriteGames" >Loading Favorite Games</label>
    <span style="font-size:34px; font-weight:bold"  v-else> {{errorMessageForLoggedInUser}}</span>
    </div>
    </div>
    
    <label style="font-size:24px; margin-left:1%" v-if="!loadingNextGame || loadingFavoriteGames">Loading...</label>
  </div>
</template>

<script>
import LeagueInfo from "../components/LeagueInfo";
import FavoriteGames from "../components/FavoriteGames";
import LoginPage from "../pages/LoginPage";
export default {
  components: {
    LeagueInfo, 
    LoginPage, 
    FavoriteGames
  },
  data(){
    return{
      errorMessageForLoggedInUser:"No Favorite Games",
      favoriteGames:undefined,
      loadingNextGame:false,
      loadingFavoriteGames:true,
      firstLoading:true
    }
  },
  created(){
    this.getFavoriteGames().then(this.firstLoading=false)
  },
  
  methods:{
    async getFavoriteGames(){
      try{
        if(this.$root.store.username){//if user is logged in
          this.loadingFavoriteGames=true;
      this.axios.withCredentials=true;
      const response=await this.axios.get("http://localhost:3000/mainPage/rightColumn",{withCredentials:true});
      if(response.status==204){//if no favorite games
        this.favoriteGames=undefined;
      }
      else if(response.status==200){// if there are favorite games
        this.favoriteGames=response.data;
      }
        }
        this.loadingFavoriteGames=false;
    }
    
    catch(error){
      console.log(error);
    }
    },
    /**
      This function change the status of loading league information
     */
    changeLoading(){
      this.loadingNextGame=true;
      }
  }
};
</script>

<style >
 .screen{
   height: 100%;
   width: 50%;
   position: fixed;
   z-index: 1;
 }
 .leftScreen{
   left: 0;
   margin-left: 1%;
 }
 .rightScreen{
   right: 0;
 }
</style>
