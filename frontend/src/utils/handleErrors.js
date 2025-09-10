// src/utils/handleErrors.js
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useHandle404Redirect = () => {
  const navigate = useNavigate();

  const handle404 = useCallback(
    (err) => {
      const status = err?.response?.status || err?.status;

      if (status === 404) {
        navigate("/page-not-found");
      } else {
        console.error("Unhandled error:", err);
      }
    },
    [navigate]
  );

  return handle404;
};
