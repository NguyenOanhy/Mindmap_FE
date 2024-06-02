import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDataFromFirestoreById } from "../../firebase";
import { Tree, Mind } from "tree-graph-react";
import { useNavigate } from 'react-router-dom';
import domtoimage from 'dom-to-image';
import Modal from "react-modal";
import Form from "../../components/Form";

const OpenMap = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const [selectedType, setSelectedType] = React.useState("mind");
  const [nodes, setNodes] = useState(null); // Trạng thái mới để lưu trữ dữ liệu mindmap
  const { itemId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMap, setCurrentMap] = useState("");

  const handleChangeMap = (event) => {
    setSelectedType(event.target.value);
  };

  const handleChange = (e) => {
    let savedData = ref.current.saveNodes().data;
    // setNodes(savedData);
    setCurrentMap(savedData);
  };


  const exportCardToImage = async () => {
    const cardNode = document.getElementById('mindmap'); // Replace 'card' with the ID of your SVG card element
    try {
      // Convert the canvas to an image using dom-to-image
      const dataUrl = await domtoimage.toJpeg(cardNode, {bgcolor: '#ffffff'});
  
      // Create a temporary download link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'card.jpg'; // Specify the desired filename
      link.click();
    } catch (error) {
      console.error('Error exporting card to image:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Xử lý lưu dữ liệu
    setIsSaving(false);
    setShowModal(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromFirestoreById
      (itemId, "Mindmap");
      console.log(data)
      setNodes(data.data);
      setCurrentMap(data.data)
    }
    fetchData();
  }, []);

  return (
    <div className="mt-8">
      {nodes && (
        <div className="flex flex-col justify-center items-center">
          <div className="flex gap-2 ">
            <div 
            className='bg-[#06325E] hover:bg-[#050828] w-[52px] flex px-2 rounded-lg cursor-pointer justify-center items-center'
            onClick={() => navigate("/private/library")}>
                  <p className='text-white'>Back</p>
            </div>
            <button 
              className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]' 
              onClick={handleSave} 
              disabled={isSaving} >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          <label htmlFor="viewChange">
            <select
              id="viewChange"
              value={selectedType}
              onChange={handleChangeMap}
              className="bg-white rounded-md border-2 px-4 py-2"
            >
              <option value="tree">Tree</option>
              <option value="mind">Mind</option>
              <option value="mind-single">Mind Single</option>
            </select>
          </label>
          <button id="exportmindmap" className='bg-[#06325E] hover:bg-[#050828] w-[60px] flex px-2 rounded-lg cursor-pointer justify-center items-center text-white' onClick={exportCardToImage}>Export</button>
          </div>
          {selectedType === "tree" && (
            <div id="mindmap">
              <Tree ref={ref} handleChange={handleChange} nodes={nodes} startId="001"/>
            </div>
          )}
          {selectedType === "mind" && (
            <div id="mindmap">
              <Mind ref={ref} handleChange={handleChange} nodes={nodes} startId="001"/>
            </div>
          )}
          {selectedType === "mind-single" && (
            <div id="mindmap">
              <Mind ref={ref} handleChange={handleChange} nodes={nodes} singleColumn startId="001"/>
            </div>
          )}
        </div>
      )}

    <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
              },
            }}
          >
            <Form _currentItem={currentMap} onClose={() => setShowModal(false)} place={"Mindmap"}/>
    </Modal>
    </div>
  )

}

export default OpenMap;