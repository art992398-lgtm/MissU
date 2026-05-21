import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, updateDoc,
  collection, query, where, onSnapshot,
  addDoc, getDocs, serverTimestamp, limit,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);

  async function register(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    const profile = {
      uid: result.user.uid, displayName, email,
      bio: '', avatarEmoji: '💕', photoURL: null,
      relationshipStart: new Date().toISOString().split('T')[0],
      partnerId: null, createdAt: new Date().toISOString(),
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

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const snap = await getDoc(doc(db, 'users', result.user.uid));
    if (!snap.exists()) {
      const profile = {
        uid: result.user.uid,
        displayName: result.user.displayName || 'User',
        email: result.user.email,
        photoURL: result.user.photoURL || null,
        bio: '', avatarEmoji: '💕',
        relationshipStart: new Date().toISOString().split('T')[0],
        partnerId: null, createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', result.user.uid), profile);
      setUserProfile(profile);
    } else {
      setUserProfile(snap.data());
    }
    return result;
  }

  async function uploadProfilePhoto(file) {
    if (!currentUser) return null;
    const ref = storageRef(storage, `profiles/${currentUser.uid}`);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    await updateUserProfile(currentUser.uid, { photoURL: url });
    return url;
  }

  function uploadLocalPhoto(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        updateLocalProfile({ photoURL: url });
        resolve(url);
      };
      reader.readAsDataURL(file);
    });
  }

  async function logout() {
    if (isLocal) {
      localStorage.removeItem('missu_local_user');
      setCurrentUser(null);
      setUserProfile(null);
      setPartnerProfile(null);
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

  async function loadPartnerProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) setPartnerProfile(snap.data());
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

  // ── Partner system ──────────────────────────────────────────────

  async function searchUsers(nameQuery) {
    if (!nameQuery.trim() || !currentUser) return [];
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', nameQuery),
      where('displayName', '<=', nameQuery + '\uf8ff'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => d.data())
      .filter(u => u.uid !== currentUser.uid);
  }

  async function sendPartnerRequest(toUser) {
    if (!currentUser || !userProfile) return;
    // prevent duplicate
    const q = query(
      collection(db, 'partnerRequests'),
      where('fromUid', '==', currentUser.uid),
      where('toUid', '==', toUser.uid),
      where('status', '==', 'pending')
    );
    const existing = await getDocs(q);
    if (!existing.empty) return 'already_sent';
    await addDoc(collection(db, 'partnerRequests'), {
      fromUid: currentUser.uid,
      fromName: userProfile.displayName,
      fromEmoji: userProfile.avatarEmoji || '💕',
      fromPhoto: userProfile.photoURL || null,
      toUid: toUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return 'sent';
  }

  async function acceptPartnerRequest(req) {
    await updateDoc(doc(db, 'partnerRequests', req.id), { status: 'accepted' });
    await updateDoc(doc(db, 'users', currentUser.uid), { partnerId: req.fromUid });
    await updateDoc(doc(db, 'users', req.fromUid), { partnerId: currentUser.uid });
    setUserProfile(prev => ({ ...prev, partnerId: req.fromUid }));
    await loadPartnerProfile(req.fromUid);
  }

  async function declinePartnerRequest(requestId) {
    await updateDoc(doc(db, 'partnerRequests', requestId), { status: 'declined' });
  }

  async function removePartner() {
    if (!userProfile?.partnerId || !currentUser) return;
    const pid = userProfile.partnerId;
    await updateDoc(doc(db, 'users', currentUser.uid), { partnerId: null });
    await updateDoc(doc(db, 'users', pid), { partnerId: null });
    setUserProfile(prev => ({ ...prev, partnerId: null }));
    setPartnerProfile(null);
  }

  // ── Effects ─────────────────────────────────────────────────────

  // load partner profile when partnerId changes
  useEffect(() => {
    if (userProfile?.partnerId && !isLocal) {
      loadPartnerProfile(userProfile.partnerId);
    } else {
      setPartnerProfile(null);
    }
  }, [userProfile?.partnerId, isLocal]);

  // listen to incoming partner requests
  useEffect(() => {
    if (!currentUser || isLocal) {
      setIncomingRequests([]);
      return;
    }
    const q = query(
      collection(db, 'partnerRequests'),
      where('toUid', '==', currentUser.uid),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, snap => {
      setIncomingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser, isLocal]);

  // bootstrap auth
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
    currentUser, userProfile, partnerProfile, incomingRequests,
    loading, isLocal,
    register, login, loginWithGoogle, logout, loginLocal,
    updateUserProfile, updateLocalProfile,
    uploadProfilePhoto, uploadLocalPhoto,
    searchUsers, sendPartnerRequest, acceptPartnerRequest,
    declinePartnerRequest, removePartner,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
