import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'
import Modal from "react-modal";
import Form from "./Form";
import { addDataToFirestore } from "../firebase";
import { Tree, Mind } from "tree-graph-react";
import Swal from 'sweetalert2'
import domtoimage from 'dom-to-image'

const Map = ({ isLoggedIn }) => {
  const [selectedType, setSelectedType] = React.useState("mind");

  const handleChangeMap = (event) => {
    setSelectedType(event.target.value);
  };
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMap, setCurrentMap] = useState("");
  const navigate = useNavigate()

  const ref = useRef();
  const handleChange = (e) => {
    let savedData = ref.current.saveNodes().data;
    setNodes(savedData);
    setCurrentMap(savedData);
  };
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const exportCardToImage = async () => {
    const cardNode = document.getElementById('mindmap'); // Replace 'card' with the ID of your SVG card element
    try {
      // Convert the canvas to an image using dom-to-image
      const dataUrl = await domtoimage.toJpeg(cardNode, { bgcolor: '#ffffff' });

      // Create a temporary download link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'card.jpg'; // Specify the desired filename
      link.click();
    } catch (error) {
      console.error('Error exporting card to image:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/nodes', { text: text });
      console.log(response.data); // In ra kết quả trả về từ server
      setNodes(response.data);
      setCurrentMap(response.data)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // if status code is 429 display error of 429
      if (error.response.status === 429) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Too many requests from this IP, please try again later.',
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again.',
        });
      }
    }
  };

  const fileInputRef = React.useRef(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Xử lý lưu dữ liệu
    setIsSaving(false);
    setShowModal(true);
  }

  useEffect(() => {
    const setNodeColors = (rootNode) => {
      if (!rootNode) {
        console.error("Node is undefined or null");
        return;
      }

      const colors = ['#F52549', '#F9A603', '#4897D8', '#9BC01C', '#B5DDD1', '#7f7f7f', '#bcbd22', '#17becf'];
      const stack = [{ node: rootNode, level: 0 }];

      while (stack.length > 0) {
        const { node, level } = stack.pop();

        if (node) {
          node.backgroundColor = colors[level % colors.length];
          node.color = '#fff';
          const children = node.sortList.map((key) => nodesArray.find((n) => n._key === key));
          stack.push(...children.map((child) => ({ node: child, level: level + 1 })));
        }
      }
    };
    const nodesArray = Object.values(nodes);
    const rootNode = nodesArray.find((node) => node._key === '001');

    if (nodesArray.length > 0) {
      setNodeColors(rootNode);
    }
  }, [nodes]);


  return (
    <div className="flex flex-col">
      <div className='flex flex-col m-20 gap-2'>
        <textarea
          className=" h-60 p-6 border rounded no-scrollbar"
          placeholder="Paste your text here or upload a file..."
          value={text}
          onChange={handleTextChange}
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Mind Map'}
            </button>
            {isLoggedIn && (
              <button
                className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]'
                onClick={handleSave}
                disabled={isSaving} >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}

          </div>
          <div className="flex justify-end gap-2">
            {!isLoading &&
              <button id="exportmindmap"
                className='bg-[#06325E] hover:bg-[#050828] w-32 flex px-2 rounded-lg cursor-pointer justify-center items-center text-white'
                onClick={exportCardToImage}>Export
              </button>
            }
            <label htmlFor="viewChange">
              <select
                id="viewChange"
                value={selectedType}
                onChange={handleChangeMap}
                className="bg-white rounded-md border-2 px-4 py-2 right-0 top-0"
              >
                <option value="tree">Tree</option>
                <option value="mind">Mind</option>
                <option value="mind-single">Mind Single</option>
              </select>
            </label>
          </div>

        </div>
      </div>
      <div className="mt-8">
        {nodes && (

          <div className="flex flex-col justify-center items-center">
            {selectedType === "tree" && (
              <div id="mindmap">
                <Tree ref={ref} handleChange={handleChange} nodes={nodes} startId="001" />
              </div>
            )}
            {selectedType === "mind" && (
              <div id="mindmap">
                <Mind ref={ref} handleChange={handleChange} nodes={nodes} startId="001" />
              </div>
            )}
            {selectedType === "mind-single" && (
              <div id="mindmap">
                <Mind ref={ref} handleChange={handleChange} nodes={nodes} singleColumn startId="001" />
              </div>
            )}
          </div>
        )}
      </div>
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
        <Form _currentItem={currentMap} onClose={() => setShowModal(false)} place={"Mindmap"} />
      </Modal>
    </div>
  );
};

export default Map;