import React, { useRef, useState } from 'react';
import { Tree } from 'tree-graph-react';

const Mapdb = ({ mindmapData }) => {
    console.log(mindmapData)

  const ref = useRef();
  const [nodes, setNodes] = useState(null);

  return (  
    <div>
      {nodes && (
        <Tree 
          ref={ref}
          nodes={nodes} 
          startId="001"
          disabled
        />
      )}
    </div>
  );
}

export default Mapdb;