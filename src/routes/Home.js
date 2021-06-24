import React, { useEffect, useState } from 'react';
import { dbService, storageService } from 'fbase';
import Hweet from 'components/Hweet';
import { v4 as uuidv4} from 'uuid';

const Home =  ({userObj}) => {
    const [hweet, setHweet] = useState("");
    const [hweets, setHweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        dbService.collection("hweets").orderBy("createdAt", "desc").onSnapshot(snapshot => {
            const hweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setHweets(hweetArr);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        
        let attachmentUrl = "";

        if(attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const res = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await res.ref.getDownloadURL();
        }

        const hweetObj = {
            text: hweet,
            createdAt: Date.now(), 
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("hweets").add(hweetObj);            
        setHweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const { target: { value }} = event;
        setHweet(value);
    }

    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishEvent) => {
            const { currentTarget: { result }, } = finishEvent;

            setAttachment(result);
        } // read가 끝나면 이벤트 실행

        if(theFile) {
            reader.readAsDataURL(theFile);    
        }
    }

    const onClearAttachmentClick = () => setAttachment("");
        
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="What's on your mind?" maxLength={120} value={hweet} onChange={onChange}/>
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Hweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachmentClick}>Clear</button>
                    </div>
                )}
            </form>
            
            <div>
                {hweets.map((hweet) => (
                    <Hweet key={hweet.id} hweetObj={hweet} isOwner={hweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;