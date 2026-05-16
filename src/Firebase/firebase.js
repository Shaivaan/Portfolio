import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseFirestore = getFirestore(firebaseApp);

const fetchUserData = async (user_id, handleData, handleLoader) => {
  try {
    const res = await fetch(`https://career-keeper-be.vercel.app/details?user_id=${user_id}`);
    // const res = await fetch(`http://localhost:3000/details?user_id=${user_id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    handleData(json.data);
  } catch (error) {
    handleData({ user: {}, projects: [], workExp: [] });
  } finally {
    handleLoader();
  }
};


export { firebaseApp, firebaseFirestore, fetchUserData };
