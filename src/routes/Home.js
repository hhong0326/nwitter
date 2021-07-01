import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import Hweet from 'components/Hweet';
import HweetFactory from 'components/HweetFactory';

const Home =  ({userObj}) => {
    
    const [hweets, setHweets] = useState([]);
    
    useEffect(() => {
        dbService.collection("hweets").orderBy("createdAt", "desc").onSnapshot(snapshot => {
            const hweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setHweets(hweetArr);
        });
    }, []);

    
    return (
        <div className="container">
            <HweetFactory userObj={userObj}/>
            
            <div style={{ marginTop: 30 }}>
                {hweets.map((hweet) => (
                    <Hweet key={hweet.id} hweetObj={hweet} isOwner={hweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;