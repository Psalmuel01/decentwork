'use strict';

import axios from 'axios';
// import { getTokensFromCookie } from "../helper/cookie-helper";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// const { authToken, fineractToken } = getTokensFromCookie();

export const axiosInstanceWithAuthWithoutFineract = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? '',
  headers: {
    // Authorization: `Basic ${authToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
