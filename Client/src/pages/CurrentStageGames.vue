<template>
  <div >
    <h1 id="title">Games Page</h1>
    <div v-if="!loading">
    <div class="split left">  
      <div id="futureGames" v-if="futureGames">
        <h3 style="margin-left:1%;">Future Games</h3>
          <div v-if="!$root.store.username">
              <FutureGame v-for="g in futureGames" :key="g.id" :game="g"></FutureGame>
          </div>
          <div v-else>
            <FutureGameToAddToFavorites v-for="g in futureGames" :key="g.id" :game="g" @gameAdded="switchGame"></FutureGameToAddToFavorites>
            <FutureGame v-for="g in favoriteGames" :key="g.id" :game="g"></FutureGame>
          </div>
      </div>
     <span class="errorSpan" v-else>No Future Games</span>
      </div>
      <div class="split right">
      <div id="pastGames" v-if="pastGames">
        <h3>Past Games</h3>
        <FutureGame v-for="g in pastGames" :key="g.id" :game="g"></FutureGame>
      </div>
      <span class="errorSpan" v-else>No Past Games</span>
    </div>
  </div>
  <span v-else id="loading">Loading...</span>
  </div>
</template>

<script>
import FutureGame from "../components/GamePreview.vue";
import FutureGameToAddToFavorites from "../components/GameToAddToFavorites.vue";
export default {
  components:{
    FutureGame,FutureGameToAddToFavorites
  },
  data(){
    return{
      pastGames:[],
      futureGames:[],
      favoriteGames:[],
      errorMessage:"No games in database",
      loading:true
    }
  },
  mounted(){
    try{
      this.getGames();
    }
    catch(error){
      console.log(error);
    }
  },
  methods:{
    /**
     * This function gets all games in database
     */
    async getGames(){
      const response=await this.axios.get("http://localhost:3000/currentStageGames");
      if(response.status==200){//if there are games in database
        if(response.data.past_games_arr.length>0){
          this.pastGames=response.data.past_games_arr;
        }
        if(response.data.future_games_arr.length>0 ){
          if(!this.$root.store.username){//if there are no logged in user
            this.futureGames=response.data.future_games_arr;
          }
         else{
           const favoriteGamesResponse=await this.axios.get(`http://localhost:3000/users/getFavoriteGames`);
           if(favoriteGamesResponse.status==204){//if no favorite games
             this.futureGames=response.data.future_games_arr;
           }
           //divide current stage games into 2 categories: one is games that can be added to user's favorites
           // and another is games that are already in user's favorites
           else{
             for(let i=0;i<response.data.future_games_arr.length;i++){
               let favoriteGame=favoriteGamesResponse.data.find(game=>game.id===response.data.future_games_arr[i].id)
               if(favoriteGame){
                 this.favoriteGames.push(response.data.future_games_arr[i]);
               }
               else{
                 this.futureGames.push(response.data.future_games_arr[i]);
               }
             }
           }
         }   

        }
      }
     this.loading=false;
    },
    /**
     * This function switch added game from future games to user's added favorite games
     */
    switchGame(game){
      const index=this.futureGames.indexOf(game);
      this.futureGames.splice(index,1);
      this.favoriteGames.push(game);
    }
  }
}
</script>

<style>
 
  #title{
    margin-left: 25%;
    margin-right: 25%;
    margin-top: 1%;
  }
  .split {
  height: 100%;
  width: 50%;
  position: absolute;
  z-index: 1;
  overflow:auto;
}

.left {
  left: 0;
 
}

.right {
  right: 0;
  
}
#loading{
  margin-left: 1%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.errorSpan{
  font-size: 24px;
  font-weight: bold;
}
</style>