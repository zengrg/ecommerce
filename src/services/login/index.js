export const login = async (FormData) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(FormData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
