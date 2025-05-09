import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import './scss/Login.scss';

const firebaseConfig = {
    apiKey: "AIzaSyAbijrL7TYfIvkk0_etnXF2kbvfQb6sfiE",
    authDomain: "proyecto-57db9.firebaseapp.com",
    projectId: "proyecto-57db9",
    storageBucket: "proyecto-57db9.appspot.com",
    messagingSenderId: "456845746374",
    appId: "1:456845746374:web:19fb99909003b752e437c7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
const usersCollection = collection(db, "users");

// Función para registrar usuario con email y contraseña
export const registerWithEmailAndPassword = async (email, password, name, role = 'customer') => {
    try {
        // Crear usuario en Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar el perfil con el nombre
        await updateProfile(user, {
            displayName: name
        });

        // Crear documento de usuario en Firestore
        const userData = {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(usersCollection, user.uid), userData);

        // Guardar en localStorage
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);

        // Redirigir según el rol
        if (role === 'admin') {
            window.location.href = "./CrudAdmi";
        } else {
            window.location.href = "./Contact";
        }

        return user;
    } catch (error) {
        console.error("Error en el registro:", error);
        throw error;
    }
};

// Función para iniciar sesión con email y contraseña
export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(usersCollection, user.uid));
        const userData = userDoc.data();

        // Guardar en localStorage
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", userData.role);

        // Redirigir según el rol
        if (userData.role === 'admin') {
            window.location.href = "./CrudAdmi";
        } else {
            window.location.href = "./Contact";
        }

        return user;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        throw error;
    }
};

// Función para verificar si un usuario es admin
export const isAdmin = async (uid) => {
    try {
        const userDoc = await getDoc(doc(usersCollection, uid));
        const userData = userDoc.data();
        return userData?.role === 'admin';
    } catch (error) {
        console.error("Error al verificar rol:", error);
        return false;
    }
};

export const signInWithGoogle = () => {
    return signInWithPopup(auth, provider)
    .then(async (result) => {
        console.log(result);

        // Verificar si el usuario ya existe
        const userDoc = await getDoc(doc(usersCollection, result.user.uid));
        let userData;

        if (userDoc.exists()) {
            // Si el usuario existe, usar sus datos existentes
            userData = userDoc.data();
        } else {
            // Si es un nuevo usuario, crear nuevo documento
            userData = {
                uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                profilePic: result.user.photoURL,
                role: 'customer', // Por defecto, todos los usuarios de Google son customers
                createdAt: new Date().toISOString()
            };
            await setDoc(doc(usersCollection, result.user.uid), userData);
        }

        // Guardar en localStorage
        localStorage.setItem("uid", result.user.uid);
        localStorage.setItem("name", result.user.displayName);
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("profilePic", result.user.photoURL);
        localStorage.setItem("role", userData.role);

        // Redirigir según el rol
        if (userData.role === 'admin') {
            window.location.href = "./CrudAdmi";
        } else {
            window.location.href = "./Contact";
        }
    }).catch((error) => {
        console.error("Error en la autenticación:", error);
        throw error;
    });
};



