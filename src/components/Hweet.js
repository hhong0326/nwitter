import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Hweet = ({ hweetObj, isOwner }) => {

    const [editing, setEditing] = useState(false);
    const [newHweet, setNewHweet] = useState(hweetObj.text);
    const onDeleteClick = async () => {
        
        const ok = window.confirm("Are you sure?");
        if(ok) {
            // delete
            await dbService.doc(`hweets/${hweetObj.id}`).delete();
            if(hweetObj.attachmentUrl !== "") {
                await storageService.refFromURL(hweetObj.attachmentUrl).delete();
            }
        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log()

        await dbService.doc(`hweets/${hweetObj.id}`).update({
            text: newHweet,
        })
        
        setEditing(false);
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setNewHweet(value);
    }
    return (
    <div>
        {editing ? (
            <>
            {isOwner && 
            <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit Your Hweet" value={newHweet} required onChange={onChange}/>
                <input type="submit" value="Update Hweet!" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
            </>
            }
            </>
        ) : (
            <>
            <h4>{hweetObj.text}</h4>
            {hweetObj.attachmentUrl && <img src={hweetObj.attachmentUrl} width="50px" height="50px" /> }
            {isOwner && (
            <>
                <button onClick={onDeleteClick}>Delete Hweet</button>
                <button onClick={toggleEditing}>Edit Hweet</button>
            </>
            )}
            </>
        )}
        
    </div>
    )
}

export default Hweet;