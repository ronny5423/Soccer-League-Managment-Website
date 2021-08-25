<template>
  <div id="mainDiv">
      <p @click="moveToPlayerPage" id="fullName"> Full Name: {{fullName}}</p>
      <p @click="moveToTeamPage" id="teamName">Team Name: {{teamName}}</p>
      <p>Position Number: {{positionNumber}}</p>
      <img :src="profile_pic" height="200" width="250" @click="moveToPlayerPage" style="cursor:pointer">
      </div>
</template>

<script>
export default {
    props:{
        player:{
            type:Object,
            required:true
        }
    },
    data(){
        return{
            fullName:this.player.full_name,
            teamName:this.player.team_name,
            team_id:this.player.team_id,
            profile_pic:this.player.pic,
            positionNumber:this.player.position_number
        }
    },
    methods:{
        moveToPlayerPage(){
            this.$router.push(`/playerPage/${this.player.player_id}`);
        },
        moveToTeamPage(){
            if(this.team_id!=undefined){
                this.$router.push({name:"teamPageById",params:{team_id:this.team_id}});
            }
        }
    }
}
</script>

<style>
#mainDiv{
    margin-left: 1%;
    margin-bottom: 1%;
    border-color: cadetblue;
    border-width: 3px;
    width:300px;
    border-style: solid;
    border-radius: 10px;
    background-color: gray;
}

#fullName:hover{
    cursor: pointer;
    color: cadetblue;
    width: fit-content;
}
p{
    font-size: 24px;
}

#teamName:hover{
    cursor: pointer;
    color: cadetblue;
}
</style>