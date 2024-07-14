export const regex = {
  // AUTH
  username: /^[a-zA-Z0-9]{1,10}$/,
  password:
    /^(?=.*[!@#$%^&*()_+={}[\]:;'"|<,>.?/~`])(?=.*[A-Z])(?=.*[0-9]).{8,16}$/,

  // PROFILE
  name: /^[A-Za-z\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  photo: /\.(jpg|jpeg|png|gif|bmp|tiff|svg)$i/,
};
