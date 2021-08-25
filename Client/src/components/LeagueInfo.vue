<template>
  <div>
    
    <div class="league-preview" v-if="show">
      <b-card
      bg-variant="secondary"
      img-alt="Image"
      tag="article"
      style="max-width: 20rem;"
      class="mb-2"
    >
      <b-card-title>{{leagueName}}</b-card-title>
      <b-card-text>
        Season: {{ season }}
        <br/>
        Stage: {{ stage }}
        <br/>
       <div>
         <span> Next Game:</span>
         <br/>
         <nextGame :game="nextGame" v-if="nextGame"></nextGame>
       </div> 
      </b-card-text>
      </b-card>
  </div>
  
    
  </div>
</template>

<script>
import GamePreview from "../components/GamePreview.vue";

export default {
  components:{
       nextGame: GamePreview
      },
      props:{
        show:{
          type:Boolean,
          required:true
        }
      },
 data() {
    return {
      
      leagueName: "", 
      season: "", 
      stage: "",
      nextGame:undefined
    };
  },
  mounted(){
    try{
      this.getData().then(()=>{
        this.$emit('finishLoading')
      });
      
      }
    catch(err){
      console.log(err);
    }
  },
  methods:{
    async getData(){
      const response=await this.axios.get("http://localhost:3000/mainPage/leftColumn");
      if(response.status==200){
        this.nextGame=response.data.next_planned_game;
      }
      this.leagueName=response.data.league_name;
      this.season=response.data.current_season_name;
      this.stage=response.data.current_stage_name;
    }
  }
}
</script>

<style>
.league-preview {
  display: inline-block;
  position: relative;
  border-style: solid;
  border-radius: 10px;
  border-width: 5px;
  border-color:rgb(44, 89, 116);
}

.league-preview .league-title {
  text-align: center;
  text-transform: uppercase;
  color:  rgb(111, 155, 197);
}

.league-preview .league-content {
  width: 100%;
  overflow: hidden;
}

</style>