// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

// export default API;

export const predictData = async (data: any) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
  }
};