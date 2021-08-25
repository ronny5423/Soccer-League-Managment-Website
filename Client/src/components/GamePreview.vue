<template>
  <div class="game-preview">
    
    <ul class="game-content">
      <li class="team" @click="moveToTeamPage(hostTeam)"> host: {{ hostTeam }}</li>
      <li class="team" @click="moveToTeamPage(guestTeam)"> guest: {{ guestTeam }}</li>
      <li> date: {{ date }}</li>
      <li> hour: {{ hour }}</li>
      <li> stadium: {{stadium}}</li>
      <li> referee: {{referee_name}} </li>
      <li v-if="result">result: {{result}}</li>
    </ul>
    <h3 v-if="eventsArr && eventsArr.length>0">Events In The Game:</h3>
    <EventScheduler v-if="eventsArr && eventsArr.length>0" :eventsArr="eventsArr"></EventScheduler>
  </div>
</template>

<script>
import EventScheduler from "./EventSchedule.vue";
export default {
  name: "GamePreview",
  props: {
      game:{
        type:Object,
        required:true
      }
  },
  components:{
    EventScheduler
  },
  data(){
    return{
      hostTeam:this.game.home_team,
      guestTeam:this.game.away_team,
      date:this.game.date,
      hour:this.game.hour,
      stadium:this.game.stadium,
      referee_name:this.game.referee_name,
      result:this.game.result,
      eventsArr:this.game.events_schedule
    };

  },
  mounted(){
    console.log("game preview mounted");
    
  },
  methods:{
    moveToTeamPage(team_name){
      this.$router.push({name:"teamPageByName",params:{team_name:team_name}});
      this.$emit("changeTeam")
    }
  } 
};
</script>

<style>
.game-preview {
  position: relative;
  border-style: solid;
  border-radius: 10px;
  border-width: 5px;
  border-color:cadetblue;
  background-color: azure;
  width: auto;
}

.game-preview .game-title {
  text-align: center;
  text-transform: uppercase;
  color:  rgb(111, 197, 157);
}

.game-preview .game-content {
  width: auto;
  overflow: auto;
}

.team:hover{
  cursor: pointer;
  color: aqua;
}

.team{
  width: fit-content;
}

</style>
