import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import SyncLoader from "./SyncLoader";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const messageRef = useRef();
  const collectionRef = collection(db, "messages");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!messageRef.current.value) {
      alert("Please Enter the Title");
      return;
    }

    const data = {
      message: messageRef.current.value,
      content: "", // You can set content based on your requirements
    };

    try {
      setLoading(true);
      await addDoc(collectionRef, data);
      await fetchData();
      messageRef.current.value=""
       // Move fetchData inside the try block to ensure it's called after successful data addition
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      setLoading(false); // Move setLoading(false) here to handle loading state regardless of success or failure
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const querySnapshot = await getDocs(collectionRef);
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setData(data);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTitle = async (id) => {
    try {
      setLoading(true);
      const titleDoc = doc(db, "messages", id);
      await deleteDoc(titleDoc);
      // Wait for the deletion to complete before updating the document list
      await fetchData();
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  };

  const boxShadowStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
  };

  const navigate = useNavigate();
  return (
    <>
      <div style={boxShadowStyle} className="d-flex flex-column align-items-center mt-5 rounded border py-4 w-75 mx-auto p-3 ">
        <h1 className="text-center ">Add Your Document</h1>
        <form
          onSubmit={handleSave}
          className="d-flex mt-3 gap-3  flex-wrap  w-100 justify-content-center    "
        >
          <TextField
          className="w-75 "
            id="outlined-basic"
            // style={{ width: "900px" }}
            label="Enter Document Title"
            variant="outlined"
            inputRef={messageRef}
          />
          <Button
            className="bg-primary text-white  "
            type="submit"
            variant="primary"
          >
            Add Document
          </Button>
        </form>
        <div className="w-100 d-flex flex-wrap justify-content-center mx-auto mt-4">
          {data &&
            data.map((item) => (
              <div
                className="border m-3 border-green-600 bg-light p-2 d-flex justify-content-between align-items-center font-weight-bold rounded"
                style={{ width: "349px" }}
                key={item.id}
              >
                {item.message}
                <div className="">
                  <button
                    onClick={() => navigate(`/edit/${item.id}`)}
                    className="btn btn-success py-1 rounded font-weight-light px-2 ml-3 me-2"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    onClick={() => deleteTitle(item.id)}
                    className="btn btn-danger ml-2 font-weight-normal py-1 px-2 rounded"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {loading && <SyncLoader />}
    </>
  );
}

export default Home;
