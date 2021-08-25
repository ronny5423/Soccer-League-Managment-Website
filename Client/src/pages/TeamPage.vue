<template>
  <div id="teamPageDiv" >
      <h1 style="text-align:Center">Team Page</h1>
      <div v-if="!loading && team">
          <img width="100" height="150" :src="team.team_logo">
          <div id="teamDiv">
          <div class="playersDiv splitScreen">
       <h2>Players</h2>   
      <PlayerPreview v-for="player in team.players" :key="player.player_id" :player="player"></PlayerPreview>
          </div>
      <div  class="futureGamesDiv splitScreen">
          <h2>Future Games</h2>  
          <GamePreview v-for="game in team.games.future_games_arr" :key="game.id" :game="game" @changeTeam="changeTeam"></GamePreview>
          <p v-if="team.games.future_games_arr.length==0">There are no future games</p>
      </div>
      <div class="pastGamesDiv splitScreen">
          <h2>Past Games</h2>
          <GamePreview v-for="game in team.games.past_games_arr" :key="game.id" :game="game" @changeTeam="changeTeam"></GamePreview>
          <p v-if="team.games.past_games_arr.length==0">There are no past games</p>
      </div>
      </div>
      </div>
      <label v-else-if="!loading" id="noTeamLabel">There is no such team!</label>
      <span id="loadingMessage" v-else>Loading...</span>
      
  </div>
</template>

<script>
import PlayerPreview from "../components/PlayerPreview.vue";
import GamePreview from "../components/GamePreview.vue";
export default {
    components:{
        PlayerPreview,GamePreview
    },
    data(){
        return{
            team:undefined,
            loading:true
        }
    },
    mounted(){
        try{
            this.getTeam();
        }
        catch(error){
            console.log(error);
        }
    },
    methods:{
        async getTeam(){
            let team
            this.loading=true
            if(this.$route.params.team_name){//get team by name
                team=await this.axios.get(`http://localhost:3000/personalPages/teamPageByName/${this.$route.params.team_name}`);
                }
            else if(this.$route.params.team_id){//get team by id
                team=await this.axios.get(`http://localhost:3000/personalPages/teamPage/${this.$route.params.team_id}`);
            }
            if(team.status==200){
                this.team=team.data
            }
            else{
                this.team=undefined
            }
            this.loading=false;
        },
        changeTeam(){
            this.getTeam()
        }
    }
}
</script>

<style>
.splitScreen{
    width: 100%;
    overflow: auto;
    z-index: 1;
   
}



#loadingMessage{
    font-size: 24px;
    margin-left: 1%;
}

#teamDiv{
    display: flex;
    justify-content: space-between;
}
#teamPageDiv{
    width: 100%;
    height: 100%;
    color: darkgrey;
}
#noTeamLabel{
    margin-top:1% ;
    margin-left:1%;
    color: darkorange;
    font-size: 30px;
    font-weight: bold;
}

</style>