<template>
  <div style="color:brown">
      <h1 style="text-align:center">Favorite Games Page</h1>
      <div v-if="!loading">
      <FavoriteGames v-if="games" :games="games"></FavoriteGames>
      <span style="font-size:30px; font-weight:bold" v-else> {{errorMessage}}</span>
      </div>
      <span v-else style="font-size:24px; font-weight:bold"> Loading...</span>
  </div>
</template>

<script>
import FavoriteGames from "../components/FavoriteGames.vue";
export default {
    components:{
        FavoriteGames
    },data(){
        return{
            games:undefined,
            errorMessage:"You don't have favorite games",
            loading:true
        }
    },
    mounted(){
        try{
            this.getFavoriteGames();
        }
        catch(error){
            console.log(error);
        }
    },
    methods:{
        async getFavoriteGames(){
            const response=await this.axios.get(`http://localhost:3000/users/getFavoriteGames`);
            if(response.status==200){
                this.games=response.data;
            }
            this.loading=false;
        }
    }
}
</script>

<style>

</style>