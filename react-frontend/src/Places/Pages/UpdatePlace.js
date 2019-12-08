import React from "react";
import { useParams } from "react-router-dom";
import Input from "../../Shared/Components/FromElements/Input";
import Button from "../../Shared/Components/FromElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../Shared/Util/validators";
import { useForm } from "../../Shared/Hooks/Form-hooks";
import "./PlaceForm.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484425,
      lng: -73.9867614
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: "u2"
  }
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const identefiedPlace = DUMMY_PLACES.find(place => place.id === placeId);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identefiedPlace.title,
        isValid: true
      },
      description: {
        value: identefiedPlace.description,
        isValid: true
      },
      address: {
        value: identefiedPlace.address,
        isValid: true
      }
    },
    true
  );

  if (!identefiedPlace) {
    return (
      <div className="center">
        <h2>Could no find place!</h2>
      </div>
    );
  }

  return (
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={true}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
