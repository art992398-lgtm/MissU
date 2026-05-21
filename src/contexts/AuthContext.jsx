import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);

  async function register(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    const profile = {
      uid: result.user.uid,
      displayName,
      email,
      bio: '',
      avatarEmoji: '💕',
      relationshipStart: new Date().toISOString().split('T')[0],
      partnerId: null,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', result.user.uid), profile);
    setUserProfile(profile);
    return result;
  }

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await loadUserProfile(result.user.uid);
    return result;
  }

  async function logout() {
    if (isLocal) {
      localStorage.removeItem('missu_local_user');
      setCurrentUser(null);
      setUserProfile(null);
      setIsLocal(false);
    } else {
      await signOut(auth);
    }
  }

  async function loadUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      setUserProfile(snap.data());
    }
  }

  async function updateUserProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    setUserProfile(prev => ({ ...prev, ...data }));
  }

  function loginLocal(name, emoji = '💕') {
    const uid = 'local_' + Date.now();
    const user = { uid, displayName: name, email: null, isLocal: true };
    const profile = {
      uid, displayName: name, email: null, bio: '', avatarEmoji: emoji,
      relationshipStart: new Date().toISOString().split('T')[0],
      partnerId: null, createdAt: new Date().toISOString(), isLocal: true,
    };
    localStorage.setItem('missu_local_user', JSON.stringify({ user, profile }));
    setCurrentUser(user);
    setUserProfile(profile);
    setIsLocal(true);
  }

  function updateLocalProfile(data) {
    const stored = JSON.parse(localStorage.getItem('missu_local_user') || '{}');
    const newProfile = { ...stored.profile, ...data };
    stored.profile = newProfile;
    localStorage.setItem('missu_local_user', JSON.stringify(stored));
    setUserProfile(newProfile);
  }

  useEffect(() => {
    const stored = localStorage.getItem('missu_local_user');
    if (stored) {
      const { user, profile } = JSON.parse(stored);
      setCurrentUser(user);
      setUserProfile(profile);
      setIsLocal(true);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) await loadUserProfile(user.uid);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser, userProfile, loading, isLocal,
    register, login, logout, loginLocal,
    updateUserProfile, updateLocalProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
