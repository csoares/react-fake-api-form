import { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState("");

  // Function to handle PATCH request
  const handlePatchRequest = (updatedText) => {
    const url = "http://localhost:3000/users/" + "abc@def.com";
    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: updatedText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to handle GET request to fetch the default value
  const handleGetRequest = () => {
    const url = "http://localhost:3000/users/" + "abc@def.com";
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("res: " + data.firstName);
        // Assuming the API returns an object with the `firstName` field
        setText(data.firstName);
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
      });
  };

  // useEffect to fetch default value on page load
  useEffect(() => {
    handleGetRequest();
  }, []); // Empty dependency array ensures this runs only on component mount

  // useEffect to trigger PATCH request on every text change
  useEffect(() => {
    if (text !== "") {
      const debouncePatch = setTimeout(() => {
        handlePatchRequest(text);
      }, 500); // Debounce the PATCH request by 500ms to avoid too many calls

      return () => clearTimeout(debouncePatch); // Cleanup on unmount or before the next useEffect
    }
  }, [text]);

  return (
    <div>
      <h1>Form with Auto Patch on Input Change</h1>
      <form>
        <label>
          Type Something:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
      </form>
    </div>
  );
};

export default App;
