<template>
  <div>
      <h2 style="margin-left:1%; color:white">Player Page</h2>
      <div id="playerPageDiv" v-if="!loading"> 
      <p > Full Name: {{player.full_name}}</p>
      <p>Team Name: {{player.team_name}}</p>
      <p>Position Number: {{player.position_number}}</p>
      <p >Common Name: {{player.common_name}}</p>
      <p>Nationality: {{player.nationality}}</p>
      <p> Birth Date: {{player.birth_date}}</p>
      <p>Birth Country: {{player.birth_country}}</p>
      <p v-if="player.height"> Height: {{player.height}}</p>
      <p v-if="player.weight">Weight: {{player.weight}}</p>
      <img :src="player.pic" height="200" width="300" >
      </div>
      <span v-else style="font-size:26px; color:white">Loading...</span>
  </div>
</template>

<script>
export default {
    
    data(){
        return{
            player:undefined,
            loading:true
        }
    },
    mounted(){
        try{
            this.getPlayer();
        }
        catch(error){
            console.log(error);
        }
    },
    methods:{
        async getPlayer(){
            const response=await this.axios.get(`http://localhost:3000/personalPages/playerPage/${this.$route.params.player_id}`);
            this.player=response.data;
            this.loading=false;
        }
    }
}
</script>

<style>
    p{
        margin-left: 1%;
    }
    #playerPageDiv{
    margin-top: 1%;
    margin-left: 1%;
    border-color: cadetblue;
    border-width: 3px;
    width: 400px;
    border-style: solid;
    border-radius: 10px;
    background-color: gray;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-weight: bold;
    }
</style>