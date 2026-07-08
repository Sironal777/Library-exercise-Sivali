import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { UserProfile } from "../types";

const USERS_COLLECTION = "users";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Generate a random ID (as custom auth without password)
function generateId(): string {
  return "user_" + Math.random().toString(36).substring(2, 15);
}

// Get user profile by unique ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${userId}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
  return null;
}

// Find user profile by username (case insensitive or exact match)
export async function findUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("username", "==", username.trim())
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as UserProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
  }
  return null;
}

// Create a new user profile
export async function createUserProfile(username: string): Promise<UserProfile | null> {
  const newId = generateId();
  const path = `${USERS_COLLECTION}/${newId}`;
  try {
    const newUser: UserProfile = {
      id: newId,
      username: username.trim(),
      totalPoints: 0,
      ddcScore: 0,
      catalogingScore: 0,
      filingScore: 0,
      subjectScore: 0,
      gkScore: 0,
      lastActive: new Date().toISOString()
    };
    
    await setDoc(doc(db, USERS_COLLECTION, newId), {
      ...newUser,
      lastActive: serverTimestamp()
    });
    
    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
  return null;
}

// Update game high scores and recalculate total
export async function updateUserScore(
  userId: string, 
  game: "ddc" | "cataloging" | "filing" | "subject" | "gk", 
  score: number
): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${userId}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentData = docSnap.data() as UserProfile;
      
      // Determine field to update
      const scoreFieldMap = {
        ddc: "ddcScore",
        cataloging: "catalogingScore",
        filing: "filingScore",
        subject: "subjectScore",
        gk: "gkScore"
      };
      
      const fieldName = scoreFieldMap[game];
      const previousHighScore = currentData[fieldName as keyof UserProfile] as number || 0;
      
      // Only update if current score is higher
      if (score > previousHighScore) {
        const totalPoints = 
          (game === "ddc" ? score : (currentData.ddcScore || 0)) +
          (game === "cataloging" ? score : (currentData.catalogingScore || 0)) +
          (game === "filing" ? score : (currentData.filingScore || 0)) +
          (game === "subject" ? score : (currentData.subjectScore || 0)) +
          (game === "gk" ? score : (currentData.gkScore || 0));
          
        await updateDoc(docRef, {
          [fieldName]: score,
          totalPoints: totalPoints,
          lastActive: serverTimestamp()
        });
        
        return {
          ...currentData,
          [fieldName]: score,
          totalPoints: totalPoints,
          lastActive: new Date().toISOString()
        } as UserProfile;
      }
      return currentData;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
  return null;
}

// Get global leaderboard (all users sorted by totalPoints descending)
export async function getLeaderboard(limitCount: number = 50): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy("totalPoints", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const leaders: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaders.push({
        id: data.id,
        username: data.username,
        totalPoints: data.totalPoints || 0,
        ddcScore: data.ddcScore || 0,
        catalogingScore: data.catalogingScore || 0,
        filingScore: data.filingScore || 0,
        subjectScore: data.subjectScore || 0,
        gkScore: data.gkScore || 0,
        lastActive: data.lastActive ? (data.lastActive.toDate ? data.lastActive.toDate().toISOString() : data.lastActive) : null
      });
    });
    return leaders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
  }
  return [];
}
