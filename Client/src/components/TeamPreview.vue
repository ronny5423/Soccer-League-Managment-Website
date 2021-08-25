<template>
  <div id="teamPreviewDiv">
      <p id="teamName" @click="moveToTeamPage"> Team Name: {{team.team_name}}</p>
      <img id="logo" :src="team.team_logo" @click="moveToTeamPage" width="250" height="200">
      
  </div>
</template>

<script>
export default {
    props:{
        team:{
            type:Object,
            required:true
        }
    },
    methods:{
        moveToTeamPage(){
            this.$router.push({name:"teamPageById",params:{team_id:this.team.team_id}});
        }
    }
}
</script>

<style>
    #teamName:hover{
        cursor: pointer;
        color: wheat;
    }
    #teamPreviewDiv{
    margin-left: 1%;
    margin-bottom: 1%;
    border-color: cadetblue;
    border-width: 3px;
    width: 300px;
    border-style: solid;
    border-radius: 10px;
    }
    #logo:hover{
        cursor: pointer;
    }
    #teamName{
        width: fit-content;
    }
</style>