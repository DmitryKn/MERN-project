import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const activeHttpRequests = useRef([]); //

  const sendRequest = useCallback(
    async (url, method = "GET", body, headers = {}) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal
        });

        const responseData = await response.json();

        //we want clear abort Controllers with req just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  //we will not continue with req even if we switch to another component
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
