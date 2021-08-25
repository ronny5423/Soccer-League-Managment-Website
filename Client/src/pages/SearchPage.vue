<template>
  <div id="searchDiv">
    <h1 class="title" style="color:white">Search Page</h1>
    <span style="margin-left:1%; color:white">Sort Players By:</span>
     <select style="margin-left:1%; " v-model="sortPlayersBy" @change="sortPlayersArray" >
       <option value=""></option>
       <option value="playerName" >Player Name</option>
       <option value="teamName" >Team Name</option>
   </select>
   <br/>
   <span style="margin-left:1%; color:white"> Sort Teams By:</span>
   <input style="margin-left:1%" type="checkbox" id="checkBox" v-model="sortTeamsBy" value="sortByName" @change="sortTeams">
   <label style="margin-left:0.5%;color:white" for="checkBox">Team Name</label>
   <br/>
   <h3 style="color:white">Filters</h3>
   <b-input-group class="filterInputs" prepend="Player Position"><b-form-input  v-model="playerPositionFilter"></b-form-input></b-input-group>
   <b-input-group class="filterInputs" prepend="Team Name"><b-form-input  v-model="playerTeamFilter"></b-form-input></b-input-group>
    <b-input-group><b-button  variant="primary" @click="filterPlayers">Filter</b-button></b-input-group>
    <br/>
      <h3 style="color:white">Query</h3>
    <b-input-group prepend="Search Query:" id="search-input">
      <b-form-input v-model="searchQuery"></b-form-input>
     
      <b-input-group-append>
        <b-button variant="success" :disabled="disabledSearchButton" @click="search">Search</b-button>
      </b-input-group-append>
    </b-input-group>
    <br/>
    <div v-if="searching" id="searchingDiv">
        <p>Searching...</p>
        <b-spinner variant="success" label="searching"></b-spinner>
    </div>
    
    <div id="results" v-else-if="!searching && ($root.store.lastSearch || pressedSearchButton || playersArray.length>0 || teamsArray.length>0)">
    <h1>Results:</h1>
    <span v-if="playersArray.length==0 && teamsArray.length==0 && searchQuery!='' && !searching">No Results!</span>
    <div v-else>
      <div id="playersDiv" v-if="playersArray.length!=0">
        <h2>Players:</h2>
        <div v-if="sortedAndFilteredArray.length==0">
          <playerPreview v-for="player in playersArray" :key="player.player_id" :player="player"></playerPreview>
        </div>
        <div v-else>
          <playerPreview v-for="player in sortedAndFilteredArray" :key="player.player_id" :player="player"></playerPreview>
        </div>
    </div>
    <div id="teamsDiv" v-if="teamsArray.length!=0">
      <h2>Teams</h2>
      <div v-if="!sortTeamsBy">
      <teamPreview v-for="team in teamsArray" :key="team.team_id" :team="team" ></teamPreview></div>
      <div v-else>
        <teamPreview v-for="team in sortedTeamsArray" :key="team.team_id" :team="team"></teamPreview>
      </div>
    </div>
    </div>
    
  </div>
  </div>
</template>

<script>
import playerPreview from "../components/PlayerPreview.vue";
import teamPreview from "../components/TeamPreview.vue";
export default {
  components:{
    playerPreview,teamPreview
  },
 data() {
    return {
      searchQuery:"",
      playersArray:[],
      teamsArray:[],
      coachesArray:[],
      sortPlayersBy:"",
      sortTeamsBy:false,
      filteredPlayersArray:[],
      playerPositionFilter:"",
      playerTeamFilter:"",
      sortedTeamsArray:[],
      sortedPlayersArray:[],
      sortedAndFilteredArray:[],
      searching:false,
      pressedSearchButton:false
    };
  },
  computed:{
    disabledSearchButton(){//computed attribute for deciding if search button need to be disabled
      return this.searchQuery=="";
    }
    },
  mounted(){
    try{
      if(this.$root.store.username){//if user is logged in
        this.getLastResults();
      }
    }
    catch(error){
      console.log(error);
    }
  },
  methods:{
    /**
     * This method retreives search result from server
     */
    async search(){
      if(this.searchQuery!=""){
        if(this.$root.store.username){//if user is logged in, save last query search
          this.$root.store.saveLastSearch(this.searchQuery);
        }
        this.searching=true;
        this.pressedSearchButton=true;
        const response=await this.axios.get(`http://localhost:3000/search/${this.searchQuery}`);
        if(response.status==200 || response.status==206){//if results were found
          this.playersArray=response.data.playersArray;
          this.teamsArray=response.data.teamsArray;
          this.coachesArray=response.data.coachesArray;
          this.sortTeams();
          this.sortPlayersArray();
          this.filterPlayers();
        }
        else if(response.status==204){//if no results were found
              this.playersArray=[]
              this.teamsArray=[]
              this.sortedPlayersArray=[]
              this.filteredPlayersArray=[]
              this.sortedTeamsArray=[]
              this.sortedAndFilteredArray=[]
        }
        this.searching=false;
      }
    },
    async getLastResults(){//retrieve last search results from server for logged in user
      if(this.$root.store.lastSearch){//if logged in user made a search
      this.searching=true
        this.searchQuery=this.$root.store.lastSearch;
        this.pressedSearchButton=true;
        const response=await this.axios.get(`http://localhost:3000/search/lastResults`);
        if(response.status==200){//if there are results
          this.playersArray=response.data.playersArray;
        this.coachesArray=response.data.coachesArray;
        this.teamsArray=response.data.teamsArray;
      }
      this.searching=false
      }
      
    },
    filterPlayers(){//this function filter search results with user's filter
      if(this.playersArray.length>0){//if there are players in search result
        let filteredPlayers=[];
        if(this.playerPositionFilter && this.playerTeamFilter){//if user want to filter by team name and position
          for(let i=0;i<this.playersArray.length;i++){
            if(this.playersArray[i].team_name.toLowerCase()==this.playerTeamFilter.toLowerCase() && this.playersArray[i].position_number.toString()==this.playerPositionFilter){
              filteredPlayers.push(this.playersArray[i]);
            }
          }
        }
        else if(this.playerPositionFilter){//if user want to filter only by position
          for(let i=0;i<this.playersArray.length;i++){
            if(this.playersArray[i].position_number.toString()==this.playerPositionFilter){
              filteredPlayers.push(this.playersArray[i]);
            }
          }
        }
        else if(this.playerTeamFilter){//if user want to filter only by team name
          for(let i=0;i<this.playersArray.length;i++){
            if(this.playersArray[i].team_name.toLowerCase()==this.playerTeamFilter.toLowerCase()){
              filteredPlayers.push(this.playersArray[i]);
            }
          }
        }
        this.filteredPlayersArray=filteredPlayers;
        this.mergeSortedAndFilteredPLayers();
      }
    },
    sortTeams(){
      if(this.sortTeamsBy){
        if(this.teamsArray.length!=0){
          this.sortedTeamsArray=[...this.teamsArray];
          this.sortedTeamsArray.sort((a,b)=> a.team_name.localeCompare(b.team_name));
      }
      }
      else{
        this.sortedTeamsArray=[];
      }
    },
    /**
     * This function sort players by user's chosen criteria
     */
    sortPlayersArray(){
      if(this.sortPlayersBy==""){
        this.sortedPlayersArray=[];
        this.mergeSortedAndFilteredPLayers();
        return;
      }
      if(this.playersArray.length!=0){
        this.sortedPlayersArray=[...this.playersArray];
        if(this.sortPlayersBy=="playerName"){
        this.sortedPlayersArray.sort((a,b)=>a.full_name.localeCompare(b.full_name));
      }
      else{
        this.sortedPlayersArray.sort((a,b)=>a.team_name.localeCompare(b.team_name));
      }
      }
      this.mergeSortedAndFilteredPLayers();
    },
    mergeSortedAndFilteredPLayers(){//this function merge filtered and sorted players array
      if(this.filteredPlayersArray.length==0 && this.sortedPlayersArray.length==0){
          this.sortedAndFilteredArray=[];
      }
      else if(this.filteredPlayersArray.length==0){
        this.sortedAndFilteredArray=this.sortedPlayersArray;
      }
      else if(this.sortedPlayersArray.length==0){
        this.sortedAndFilteredArray=this.filteredPlayersArray;
      }
      else{
        let mergedFilteredAndSortedArray=[];
        for( let i=0;i<this.sortedPlayersArray.length;i++){//find intersection between filtered players array and sorted players array
         this.filteredPlayersArray.find(player =>{
            if(this.sortedPlayersArray[i].player_id==player.player_id){
               mergedFilteredAndSortedArray.push(this.sortedPlayersArray[i]);
            }
          })
        }
        this.sortedAndFilteredArray=mergedFilteredAndSortedArray;
      }
    }
  }
}
</script>

<style scoped>

#search-input {
  width: 500px; 
}

.filterInputs{
  width:500px ;
}
#searchDiv{
  color:white
}
#searchingDiv{
  display: flex;
  flex-direction: row;
}
</style>