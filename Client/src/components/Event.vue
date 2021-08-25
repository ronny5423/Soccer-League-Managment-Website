<template>
  <table class="table table-striped table-dark">
  <tbody>
    <tr>
      <td>Date:</td>
      <td>{{date}}</td>
     </tr>
    <tr>
      <td>Hour:</td>
      <td>{{hour}}</td>
      </tr>
    <tr>
      <td>Minute In The Game:</td>
      <td>{{minute_in_game}}</td>
      </tr>
     <tr>
      <td> Event Description:</td>
      <td>{{event_description}}</td>
    </tr>      
  </tbody>
</table>
</template>

<script>
export default {
    props:{
        event:{
          type:Object,
          required:true
        }
    },
    data(){
        return{
            date:this.event.date,
            hour:this.event.hour,
            minute_in_game:this.event.minute_in_game,
            event_description:this.event.event_description
        }
    }
}
</script>

<style>

</style>