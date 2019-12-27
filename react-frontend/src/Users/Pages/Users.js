import React, { useEffect, useState } from "react";
import UserList from "../Components/UsersList";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../Shared/Hooks/http-hook";

const Users = () => {
  const [loadedUsers, setLoadUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    // can't ASYNC()=>{} up there
    // create self invoked function
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/"
        );

        setLoadUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers(); //invoke
  }, [sendRequest]); //sendRequest is a dependancy for update state

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
