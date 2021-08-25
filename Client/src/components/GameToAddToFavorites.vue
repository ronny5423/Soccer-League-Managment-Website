<template>
  <div>
      <GamePreview :game="game"></GamePreview>
      <b-button style="margin-left: 1%; margin-top:0.5%;margin-bottom:0.5%" variant="outline-primary" @click="addToFavorites">Add To Favorites </b-button>
        <b-alert v-if="added" show dismissible>Game was successfully added!</b-alert>
  </div>
</template>

<script>
import GamePreview from "./GamePreview.vue";
export default {
components:{
    GamePreview
},
props:{
    game:{
        type:Object,
        required:true
    }
},
data(){
    return{
        added:false
    }
},
methods:{
    async addToFavorites(){
        try{
            const response=await this.axios.post(`http://localhost:3000/users/addGameToFavorites/${this.game.id}`);
            if(response.status==201){
                this.added=true;
                this.$emit("gameAdded",this.game);
            }
        }
        catch(error){
            console.log(error);
        }
    }
}
}
</script>

<style>
   
</style>