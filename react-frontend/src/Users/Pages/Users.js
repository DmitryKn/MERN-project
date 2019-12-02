import React from "react";
import UserList from "../Components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Dimko",
      image: "https://a.wattpad.com/cover/84608722-352-k886345.jpg",
      places: 3
    },
    {
      id: "u2",
      name: "Pashko",
      image:
        "https://i.pinimg.com/originals/c0/b7/7f/c0b77faeb2cb3e67fd1b423c4535f6c3.jpg",
      places: 1
    }
  ];

  return (
    <div>
      <UserList items={USERS} />
    </div>
  );
};

export default Users;
