import axios from "axios"; 
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../Config";

export function useContent() {
  const [contents, setContents] = useState([]);

  function refresh() {
    axios.get(`${BACKEND_URL}/api/v1/content`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((response) => {
      setContents(response.data);
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
  }

  useEffect(() => {
    refresh(); // fetch once on mount
  }, []); // no unnecessary re-renders

  return { contents, refresh };
}
