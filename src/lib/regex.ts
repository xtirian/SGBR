export const regex = {
  // GLOBAL
  photo: /.*\.(jpg|jpeg|png|gif|bmp|tiff|svg)$/i,
  // AUTH
  username: /^[a-zA-Z0-9]{1,10}$/,
  password:
    /^(?=.*[!@#$%^&*()_+={}[\]:;'"|<,>.?/~`])(?=.*[A-Z])(?=.*[0-9]).{8,16}$/,

  // PROFILE
  name: /^[A-Za-z\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,

  // PLACE
  state:
    /^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/,
  city: /^[A-Za-z\s]+$/,
  title: /^[A-Za-z\s]+$/,
};
