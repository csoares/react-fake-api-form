import { useState, useEffect, useRef } from "react";
import TextField from "./components/Textfield"; // Import the TextField component
import SelectField from "./components/SelectField"; // Import the SelectField component

const App = () => {
  // State to hold all form fields dynamically
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    sex: "male", // default to male or female
    isAdult: "yes", // default to yes or no
  });

  // Store timeout references for debouncing text fields
  const debounceTimeout = useRef({});
  
  const url = "http://localhost:3000/users/1"; // Replace '1' with the actual dynamic ID if needed

  // Function to handle PATCH request for a specific field
  const handlePatchRequest = (field, value) => {
    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [field]: value, // Dynamically send the updated field
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Success updating ${field}:`, data);
      })
      .catch((error) => {
        console.error(`Error updating ${field}:`, error);
      });
  };

  // Function to handle GET request to fetch the default values
  const handleGetRequest = () => {
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
        // Assuming the API returns an object with all the fields
        setFormFields({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: data.password || "",
          sex: data.sex || "male", // Default to male if not provided
          isAdult: data.isAdult || "yes", // Default to yes if not provided
        });
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
      });
  };

  // useEffect to fetch default values on page load
  useEffect(() => {
    handleGetRequest();
  }, []); // Empty dependency array ensures this runs only on component mount

  // Debounced update for text fields
  const handleDebouncedPatchRequest = (name, value) => {
    // Clear any previous timeout for the field
    if (debounceTimeout.current[name]) {
      clearTimeout(debounceTimeout.current[name]);
    }

    // Set a new timeout to delay the PATCH request
    debounceTimeout.current[name] = setTimeout(() => {
      handlePatchRequest(name, value);
    }, 500); // 500ms delay after user stops typing
  };

  // Generic onChange handler for form inputs and selects
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Update form fields state
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));

    // If the field is a text field or password field, debounce the PATCH request
    if (type === "text" || type === "email" || type === "password") {
      handleDebouncedPatchRequest(name, value);
    } else {
      // For other fields (like select), send PATCH immediately
      handlePatchRequest(name, value);
    }
  };

  return (
    <div>
      <h1>Form with Auto Patch on Input Change</h1>
      <form>
        {/* Text Fields */}
        <TextField
          label="First Name"
          name="firstName"
          value={formFields.firstName}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formFields.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={formFields.email}
          onChange={handleChange}
          type="email"
        />
        <TextField
          label="Password"
          name="password"
          value={formFields.password}
          onChange={handleChange}
          type="password"
        />

        {/* Select Fields */}
        <SelectField
          label="Sex"
          name="sex"
          value={formFields.sex}
          onChange={handleChange}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <SelectField
          label="Is Adult"
          name="isAdult"
          value={formFields.isAdult}
          onChange={handleChange}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </form>
    </div>
  );
};

export default App;
