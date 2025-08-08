// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cloud storage functions
export const saveUserData = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: true, data: null };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveCard = async (userId, cardId, cardData) => {
  try {
    await setDoc(doc(db, 'users', userId, 'cards', cardId), cardData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserCards = async (userId) => {
  try {
    const cardsRef = collection(db, 'users', userId, 'cards');
    const snapshot = await getDocs(cardsRef);
    const cards = [];
    snapshot.forEach(doc => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, cards };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteCard = async (userId, cardId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'cards', cardId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateCard = async (userId, cardId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId, 'cards', cardId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};