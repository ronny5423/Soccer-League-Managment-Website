<template>
  <div class="container">
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
      <b-form-group
        id="input-group-username"
        label-cols-sm="3"
        label="Username:"
        label-for="username"
        description="username should contain only letters and 3 to 8 charachters long"
      >
      
        <b-form-input
          id="username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
               
        <b-form-invalid-feedback v-if="!$v.form.username.required">
          Username is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.username.length">
          Username length should be between 3-8 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.username.alpha">
          Username must contain only letters
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-country"
        label-cols-sm="3"
        label="Country:"
        label-for="country"
      >
        <b-form-select
          id="country"
          v-model="$v.form.country.$model"
          :options="countries"
          :state="validateState('country')"
        ></b-form-select>
        <b-form-invalid-feedback>
          Country is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="password"
        description="password should be 5-10 characters long and contain at least one digit and one special character"
      >
        <b-form-input
          id="password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
          
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.password.required">
          Password is required
        </b-form-invalid-feedback>
        <b-form-text v-else-if="$v.form.password.$error" text-variant="info">
          Your password should be <strong>strong</strong>. <br />
          For that, your password should be also:
        </b-form-text>
        <b-form-invalid-feedback
          v-if="$v.form.password.required && !$v.form.password.length"
        >
          Have length between 5-10 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.password.containsOneDigitAndOneChar">
           You should enter at least one digit and one special character</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-confirmedPassword"
        label-cols-sm="3"
        label="Confirm Password:"
        label-for="confirmedPassword"
      >
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="$v.form.confirmedPassword.$model"
          :state="validateState('confirmedPassword')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required">
          Password confirmation is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.form.confirmedPassword.sameAsPassword"
        >
          The confirmed password is not equal to the original password
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-firstName" label-cols-sm="3" label="First Name:" label-for="firstName">
        <b-form-input id="firstName" type="text" v-model="$v.form.firstName.$model" :state="validateState('firstName')"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.firstName.required"> First name is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.firstName.alpha">First name must contain only letters</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-lastName" label-cols-sm="3" label="Last Name:" label-for="lastName">
        <b-form-input id="lastName" type="text" v-model="$v.form.lastName.$model" :state="validateState('lastName')"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.lastName.required">Last name is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.lastName.alpha">Last name must contain only letters</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-email" label-cols-sm="3" label="Email:" label-for="email">
        <b-form-input id="email" type="email" v-model="$v.form.email.$model" :state="validateState('email')"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.email.required">Email must be provided</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.email.email">Email must be valid</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-profile_pic" label-cols-sm="3" label="Image Url" label-for="profile_pic">
        <b-form-input id="profile_pic" type="url" v-model="$v.form.profile_pic.$model" :state="validateState('profile_pic')"></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.profile_pic.required">Profile picture must be provided</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.profile_pic.url">Profile picture must be url</b-form-invalid-feedback>
      </b-form-group>


      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button
        type="submit"
        variant="primary"
        style="width:250px;"
        class="ml-5 w-75"
        >Register</b-button
      >
      <div class="mt-2">
        You have an account already?
        <router-link to="login"> Log in here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Register failed: {{ form.submitError }}
    </b-alert>
    <!-- <b-card class="mt-3 md-3" header="Form Data Result">
      <pre class="m-0"><strong>form:</strong> {{ form }}</pre>
      <pre class="m-0"><strong>$v.form:</strong> {{ $v.form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
import countries from "../assets/countries";
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  email,
  url
} from "vuelidate/lib/validators";


export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        profile_pic:"",
        submitError: undefined
      },
      countries: [{ value: null, text: "", disabled: true }],
      errors: [],
      validated: false
    };
  },
  validations: {
    form: {
      username: {
        required,
        length: (u) => minLength(3)(u) && maxLength(8)(u),
        alpha
      },
      country: {
        required
      },
      password: {
        required,
        length: (p) => minLength(5)(p) && maxLength(10)(p),
        containsOneDigitAndOneChar: (p)=>{
          let specialChars=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
          let digits=new RegExp("[0-9]");
          if(!specialChars.test(p) || !digits.test(p)){
            return false;
          }
          return true;
        }
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs("password")
      },
      firstName:{
        required,
        alpha
      },
      lastName:{
        required,
        alpha
      },
      email:{
        required,
        email
      },
      profile_pic:{
        required,
        url
      }
    }
  },
  mounted() {
    // console.log("mounted");
    this.countries.push(...countries);
    // console.log($v);
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Register() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/Register",
          {
            username: this.form.username,
            password: this.form.password,
            country:this.form.country,
            first_name:this.form.firstName,
            last_name:this.form.lastName,
            email:this.form.email,
            profile_pic:this.form.profile_pic
          }
        );
        console.log(response);
        if(response.status==201){// if registration was successful
          this.$router.push("/login");
        // console.log(response);
        }
        
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data;
      }
    },
    onRegister() {
      // console.log("register method called");
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      // console.log("register method go");
      this.Register();
    },
    onReset() {
      this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        profile_pic:""
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 500px;
  margin-top: 1%;
  color:darkgreen;
  background-color: white;
}

</style>
