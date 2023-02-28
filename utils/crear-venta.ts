/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import axios from "axios";
import { BASE_URL } from "../constants/api-constants";

export const crearVenta = async (data) => {
  let result;

  const url = `${BASE_URL}venta`;

  const axiosInstance = axios.create({
    timeout: 50000,
  });
  await axiosInstance({
    baseURL: url,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 201) {
        const data: any = response.data;
        if (data) {
          result = data;
        }
      }
    })
    .catch(() => {
      console.log("Ha ocurrido un error");
    });
  return result;
};
