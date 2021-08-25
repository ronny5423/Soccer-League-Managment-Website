<template>
<div>
<div v-if="!loading">
  <div class="left split">
      <h1 style="text-align:center"> Add Game To System</h1>
      <b-form @submit.prevent="validateForm" @reset.prevent="resetForm" style="max-width:500px">
          <b-form-group label="Home Team" label-for="homeTeamInput">
              <b-form-input id="homeTeamInput" v-model="$v.form.home_team.$model" type="text" placeholder="Home Team" :state="validateState('home_team')"></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.home_team.required && home_team==''">Home team must be provided</b-form-invalid-feedback>
              <b-form-invalid-feedback v-if="!$v.form.home_team.alpha && home_team!=''">Home team name must contain only letters</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Away Team" label-for="awayTeamInput">
                  <b-form-input id="awayTeamInput" v-model="$v.form.away_team.$model" type="text" placeholder="Away Team" :state="validateState('away_team')"></b-form-input>
                  <b-form-invalid-feedback v-if="!$v.form.away_team.required && away_team==''">Away team must be provided</b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.away_team.alpha && away_team!=''">Away team name must contain only letters</b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.away_team.sameAsHomeTeam && away_team!=''"> Away Team must be differrent from home team</b-form-invalid-feedback>
                  </b-form-group>
          <b-form-group label="Date Of The Match" label-for="dateInput">
              <b-form-datepicker id="dateInput" locale="en-US" v-model="$v.form.date.$model" :State="validateState('date')" class="mb-2"></b-form-datepicker>
              <b-form-invalid-feedback v-if="!$v.form.date.required && date==''">Date must be provided</b-form-invalid-feedback>
              </b-form-group>
          <b-form-group label="Time Of The Game" label-for="timeInput">
              <b-form-timepicker v-model="$v.form.time.$model" locale="en-US" :state="validateState('time')"></b-form-timepicker>
              <b-form-invalid-feedback v-if="!$v.form.time.required && time==''"> Time of the game must be provided</b-form-invalid-feedback>
              </b-form-group>
          <b-form-group label="Stadium" label-for="stadiumInput">
              <b-form-input id="stadiumInput" v-model="$v.form.stadium.$model" type="text" placeholder="Stadium" :state="validateState('stadium')"></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.stadium.required && stadium==''">Stadium name must be provided</b-form-invalid-feedback>
              <b-form-invalid-feedback v-if="!$v.form.stadium.lettersValidator && stadium!=''">Stadium name must contain only letters</b-form-invalid-feedback>
              </b-form-group>
          <b-form-group label="Referee" label-for="refereeInput">
              <b-form-input v-model="$v.form.referee.$model" type="text" placeholder="Referee" :state="validateState('referee')"></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.referee.required && referee==''">Referee name must be provided</b-form-invalid-feedback>
              <b-form-invalid-feedback v-if="!$v.form.referee.lettersValidator && referee!=''">Referee name must contain only letters</b-form-invalid-feedback>
              </b-form-group>
              <b-button style="margin-right:1%" type="submit" variant="primary">Submit</b-button>
             <b-button type="reset" variant="danger">Reset</b-button>
              </b-form>
            <div id="alertsDiv">
            <div v-if="processing" class="processingDiv">    
            <b-alert variant="info" show="">Processing</b-alert>
            <b-spinner label="Processing"></b-spinner>   
            </div>     
            <b-alert v-if="form.success && !processing" variant="success" show="">{{form.success}}</b-alert>
            <b-alert v-else-if="form.errorMessage && !processing" variant="danger" show="">{{form.errorMessage}}</b-alert>
            </div>
  </div>
  <div class="right split">
      <p id="teamsHeader">Teams In League</p>
      <ol>
          <li v-for="(team,index) in teams_names" :key="index" @click="moveToTeamPage(team.id)" class="teams">{{team.name}}</li>
      </ol>
  </div>
</div>
<div v-else class="processingDiv loadingDiv">
    <label>Loading...</label>
    <b-spinner label="loading"></b-spinner>
</div>
</div>
</template>

<script>
import{required,alpha,helpers} from "vuelidate/lib/validators";
const lettersValidator=helpers.regex('validLetters',/^[a-z ]*$/i)
export default {
    data(){
        return{
            form:{
            home_team:"",
            away_team:"",
            date:"",
            time:"",
            stadium:"",
            referee:"",
            errorMessage: "",
            success:""
            },
            processing:false,
            teams_names:[],
            loading:true
        }
    },
    validations:{
        form:{
            home_team:{
                required,alpha
            },
            away_team:{
                required,alpha,
                sameAsHomeTeam: (b,vm)=>{
                   if(b!="" && vm.home_team!=""){
                        return (b.toLowerCase()!=vm.home_team.toLowerCase())
                   }
                   return true
                }
            },
            date:{
                required
            },
            time:{
                required
            },
            stadium:{
                required,lettersValidator
            },
            referee:{
                required,lettersValidator
            }
        }
    },
    mounted(){
        try{
            this.getTeamsNames()
        }
        catch(error){
            console.log(error)
        }
    },
    methods:{
      validateState(param) {
        const { $dirty, $error } = this.$v.form[param];
        return $dirty ? !$error : null;
        },
        /**
         * This function adds a game to the system
         */
        async addGame(){
            try{
                this.processing=true;
                this.form.success=undefined;
                this.form.errorMessage=undefined;
                let date_and_time=this.form.date+" "+this.form.time;
                const response=await this.axios.post(`http://localhost:3000/leagueManagment/addGameToSystem`,{
                    home_team:this.form.home_team,
                    away_team:this.form.away_team,
                    date_and_time:date_and_time,
                    stadium:this.form.stadium,
                    referee:this.form.referee
                });
                if(response.status==201){//if game was added successfully
                      this.form.success="Game was successfully added!";  
                }
                else if(response.status==409){
                    this.form.errorMessage="Game was already added to the system";
                }
                else if(response.status==400){
                    this.form.errorMessage="Bad teams names";
                }
                this.processing=false;
            }
            catch(error){
                this.form.errorMessage=error.response.data;
                this.processing=false;
            }
        },
        async getTeamsNames(){
            this.loading=true
            const names=await this.axios.get(`http://localhost:3000/leagueManagment/getAllTeamsInLeague`)
            this.teams_names=names.data
            this.loading=false
        },
        validateForm(){
             this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            this.addGame();
        },
        resetForm(){
            this.form={
                home_team:"",
                away_team:"",
                date:"",
                time:"",
                stadium:"",
                referee:"",
                alertMessage:""
            };
            this.$nextTick(() => {
                this.$v.$reset();
        });
        },
        moveToTeamPage(id){
            this.$router.push({name:"teamPageById",params:{team_id:id}});
        }
    }
}
</script>

<style>
    #alertsDiv{
        margin-top: 1%;
    }
    .left{
        color: darkorange;
        left: 0;
    }
    .right{
        right: 0;
    }
    .split{
        width: 50%;
        height: 100%;
        position: fixed;
        z-index: 1;
    }
    .processingDiv{
        display: flex;
        flex-direction: row;
    }
    .teams{
        margin-top:1% ;
        font-weight: bold;
        font-size: 24px;
        color: darkgoldenrod;
        width: fit-content;
    }
    .teams:hover{
        color: darkred;
        cursor: pointer;
    }
    #teamsHeader{
        margin-top:1%;
        font-size: 35px;
        color: darkmagenta;
    }
    .loadingDiv{
        margin-left:1% ;
        margin-top: 1%;
        font-size: 24px;
        color: darkorange;
    }
</style>