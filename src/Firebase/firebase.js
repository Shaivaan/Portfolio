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
    const userDocRef = doc(firebaseFirestore, "users", user_id);
    const userDocSnapshot = await getDoc(userDocRef);

    let userData = null;
    if (userDocSnapshot.exists()) {
      userData = userDocSnapshot.data();
    }

    const projectsQuery = query(
      collection(firebaseFirestore, "projects"),
      where("user_id", "==", user_id)
    );
    const projectsQuerySnapshot = await getDocs(projectsQuery);
    const projectsData = projectsQuerySnapshot.docs.map((doc) => doc.data());
    const workExpQuery = query(
      collection(firebaseFirestore, "workExp"),
      where("user_id", "==", user_id)
    );
    const workExpQuerySnapshot = await getDocs(workExpQuery);
    const workExpData = workExpQuerySnapshot.docs.map((doc) => doc.data());
    let portfolioData = {
      user: userData,
      projects: projectsData,
      workExp: workExpData,
    };
    handleData(portfolioData);
    console.log(portfolioData, "dsadasdasd");
  } catch (error) {
    handleData({ user: {}, projects: [], workExp: [] });
  }
  finally{
    handleLoader();
  }
};

export { firebaseApp, firebaseFirestore, fetchUserData };
