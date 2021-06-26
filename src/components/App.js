import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from 'fbase';

function App() {
  
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if(user) {
        if(user.displayName == null) {
          const idx = user.email.indexOf("@");
          const displayName = user.email.substring(0, idx);
          await user.updateProfile({displayName})
        }
        setUserObj(user);
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args) => user.updateProfile(args)
        // });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => { // reRendering 되는 object가 크면 변경되지 않는 버그가 생길 수 있다
    
    setUserObj({ ...authService.currentUser });
    // const user = authService.currentUser;
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args) => user.updateProfile(args)
    // })
  }
    
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..." }
      <footer>&copy; {new Date().getFullYear()} Hwitter </footer>
    </>
  );
}

export default App;
