// Import the functions you need from the SDKs you need
import axios, { Axios } from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from  "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, where, orderBy, startAt, endAt } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-LlCuLrJcXvXC2hqZFmfuNxiUeEOB21A",
  authDomain: "mindmap-c1533.firebaseapp.com",
  projectId: "mindmap-c1533",
  storageBucket: "mindmap-c1533.appspot.com",
  messagingSenderId: "586440928473",
  appId: "1:586440928473:web:4485c1d061f0a3fe6a62c8",
  measurementId: "G-4495X74511"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getDocumentById = async (documentId, dbName) => {
  try {
    const docRef = doc(db, dbName, documentId);
    const documentSnapshot = await getDoc(docRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();
      console.log(data);
      console.log("Succesfully get document", documentId);
      return data;
    } else {
      console.log("Document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

//them data vao firebase
const addDataToFirestore = async (m_name, m_data, m_tag, m_isPublic, dbName) => {
  const minValue = 10;
  const maxValue = 200;
  const randomLike = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  const randomDislike = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  try {
    const collectionRef = collection(db, dbName);
    const currentTimeStamp = new Date().getTime();
    let m_uid = null;
    if (auth.currentUser === null) {
      m_uid = null;
    } else {
      m_uid = auth.currentUser.uid;
    }
    const docRef = await addDoc(collectionRef, {
      name: m_name,
      data: m_data,
      uid: m_uid,
      timestamp: currentTimeStamp,
      isPublic: m_isPublic,
      tag: m_tag,
      like: randomLike,
      dislike: randomDislike
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


// xoa data khoi firebase
const deleteDataFromFirestore = async (id, dbName) => {
  try {
    const collectionRef = collection(db, dbName);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        deleteDoc(doc(db, dbName, id));
      }
    });
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const checkDoneQuizTodayByTimestamp = async (uid) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    const querySnapshot = await getDocs(collectionRef);
    const today = new Date();
    const todayTimeStamp = today.getDate();
    let isDoneQuizToday = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        const date = new Date(data.timestamp);
        const dateTimeStamp = date.getDate();
        if (todayTimeStamp === dateTimeStamp) {
          isDoneQuizToday = true;
        }
      }
    });
    return isDoneQuizToday;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};




const updateScoreAndTimestampOfScoreOfQuizzes = async (uid, score) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    const querySnapshot = await getDocs(collectionRef);
    let isUpdate = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        isUpdate = true;
        if(!checkDoneQuizTodayByTimestamp(uid)) {
          const docRef = doc(db, "scoreOfQuizzes", doc.id);
          updateDoc(docRef, {
            score: score,
            timestamp: new Date().getTime()
          });
        }
        else {
          console.log("You have done quiz today")
        }
      }
    });
    if(!isUpdate) {
      const docRef = await addDoc(collectionRef, {
        uid: uid,
        score: score,
        timestamp: new Date().getTime()
      });
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

const getRankingOfAllUsers = async () => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    let queryRef = collectionRef;
    const querySnapshot = await getDocs(queryRef);
    let ranking = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ranking.push({
        userID: data.uid,
        displayName: getUserNameByUidFromAuthOfFirebase(data.uid),
        picture: "https://qpet.vn/wp-content/uploads/2023/03/avatar-meo-cute-5.jpg",
        score: data.score
      });
    });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    // console.log(ranking);
    return ranking;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};



const getTotalScoreOfUser = async (uid) => {
  try {
    const collectionRef = collection(db, "scoreOfQuizzes");
    let queryRef = collectionRef;
    if (uid !== undefined) {
      queryRef = query(queryRef, where("uid", "==", uid));
    }
    const querySnapshot = await getDocs(queryRef);
    let totalScore = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalScore += data.score;
    });
    return totalScore;
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};



const getDataFromFirestoreByFilters = async (name, isPublic, tag, uid, startTime, endTime, dbName) => {
  try {
    const collectionRef = collection(db, dbName);

    if(name === "")
    {
      name = undefined;
    }

    let queryRef = collectionRef;
    if (name !== undefined) {
      queryRef = query(queryRef, where("name", "==", name));
    }

    if (isPublic !== undefined) {
      queryRef = query(queryRef, where("isPublic", "==", isPublic));
    }

    if (tag !== undefined && tag !== "All") {
      queryRef = query(queryRef, where("tag", "==", tag));
    }

    if (startTime !== undefined && endTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", ">=", startTime), where("timestamp", "<=", endTime));
    }
    else if( startTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", ">=", startTime));
    }
    else if( endTime !== undefined) {
      queryRef = query(queryRef, where("timestamp", "<=", endTime));
    }

    if (uid !== undefined)
    {
      queryRef = query(queryRef, where("uid", "==", uid))
    }

    const querySnapshot = await getDocs(queryRef);

    const dataWithFilters = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataWithFilters.push({
        id: doc.id,
        name: data.name,
        data: data.data,
        uid: data.uid,
        timestamp: data.timestamp,
        isPublic: data.isPublic,
        like: data.like,
        dislike: data.dislike,
        tag: data.tag
      });
    });
    // console.log(dataWithFilters);
    return dataWithFilters;
  } catch (error) {
    console.error("Error getting data by filters: ", error);
    return [];
  }
};

const getCurrentUser = () => {
  try {
    return auth.currentUser;
  } catch (error) {
    console.error("Error getting current user: ", error);
    return null;
  }
};

const getCurrentUserEmail = () => {
  try {
    const currentUser = getCurrentUser();
    return currentUser ? currentUser.email : null;
  } catch (error) {
    console.error("Error getting current user email: ", error);
    return null;
  }
};

// get specific item with id
const getDataFromFirestoreById = async (id, dbName) => {
  try {
    const docRef = doc(db, dbName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        data: data.data,
        uid: data.uid,
        timestamp: data.timestamp,
        isPublic: data.isPublic,
        like: data.like,
        dislike: data.dislike,
        tag: data.tag
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};



const getLikenDislike = async (mID) => {
  try {
    // count number of document with where isLike field is true
    const querySnapshot = await getDocs(collection(db, "LikeStatus"));
    const isLikeCount = querySnapshot.docs.filter((doc) => (doc.data().isLike === true && doc.data().mapID === mID)).length;
    const isDislikeCount = querySnapshot.docs.filter((doc) => (doc.data().isLike === false && doc.data().mapID === mID)).length;
    return { isLikeCount, isDislikeCount };
  }
  catch (error) {
    console.error("Error getting like and dislike: ", error);
    return null;
  }
};


const setLikeStatus = async (mID, isLike) => {
  try {
    const collectionRef = collection(db, "LikeStatus");
    const docRef = await addDoc(collectionRef, {
      mapID: mID,
      isLike: isLike,
      uid: auth.currentUser.uid
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};

export { auth, db, getDocumentById, addDataToFirestore, getCurrentUserEmail, getCurrentUser, getDataFromFirestoreByFilters, getLikenDislike, setLikeStatus, getDataFromFirestoreById, getRankingOfAllUsers, updateScoreAndTimestampOfScoreOfQuizzes };