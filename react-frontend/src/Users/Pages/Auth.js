import React from "react";
import Input from "../../Shared/Components/FromElements/Input";
import Button from "../../Shared/Components/FromElements/Button";
import Card from "../../Shared/Components/UIElements/Card";
import { useForm } from "../../Shared/Hooks/Form-hooks";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from "../../Shared/Util/validators";

import "./Auth.css";

const Auth = () => {
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const authSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };
  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form className="place-form" onSubmit={authSubmitHandler}>
        <Input
          id="email"
          element="input"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]} //checking if the input not an empty
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]} //checking if the input not an empty
          errorText="Please enter a valid password.(At least 5 characters.)"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
      </form>
    </Card>
  );
};

export default Auth;
