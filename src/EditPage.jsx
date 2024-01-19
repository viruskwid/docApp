import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SyncLoaderr from "./SyncLoader";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./firebase";
import toast, { Toaster } from "react-hot-toast";

function EditPage() {
  const { id } = useParams();
  const [quillContent, setQuillContent] = useState("");
  const [quillHead, setQuillHead] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const navigate=useNavigate()

  const fetchDocumentById = async () => {
    setLoading(true);
    const db = getFirestore();
    const documentRef = doc(db, "messages", id); // Replace 'yourCollection' with the actual collection name

    try {
      const docSnapshot = await getDoc(documentRef);

      if (docSnapshot.exists()) {
        const documentData = docSnapshot.data();
        setQuillHead(documentData.message);
        setQuillContent(documentData.content);
        setLoading(false);
      } else {
        console.log("Document does not exist.");
        setLoading(false);
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentById();
  }, []);

  const handleQuillChange = (content) => {
    setQuillContent(content);
  };

  const handleSave = async () => {
    setLoading(true);
    const documentRef = doc(db, "messages", id);

    try {
      const existingDocument = await getDoc(documentRef);

      if (existingDocument.exists()) {
        const existingData = existingDocument.data();
        await updateDoc(documentRef, {
          ...existingData,
          content: quillContent,
        });
        setLoading(false);
        toast.success("Document content successfully updated!");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (error) {
      console.error("Error updating document content: ", error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="text-center ">Craft your document</h1>
      <Row className="justify-content-md-center mt-10">
        <Col
          sm={8}
          xs={12}
          className="border-4 border-dashed border-green-400 mt-10 p-2 sm:p-5"
        >
          <h1 className="font-bold text-2xl uppercase mb-3">{quillHead}</h1>
          <ReactQuill
            onFocus={() => setFocus(true)}
            value={quillContent}
            onChange={handleQuillChange}
          />
          {focus && (
            <Button
              onClick={handleSave}
              variant="success"
              className="px-4 py-1 font-bold cla rounded mt-4"
            >
              Save
            </Button>
          )}
          <Toaster position="top-center" />
          {loading && <SyncLoaderr />}
        </Col>
      </Row>
    </Container>
  );
}

export default EditPage;
