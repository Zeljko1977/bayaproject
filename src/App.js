import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"
import { Spin } from "react-loading-io";
import bayaLogo from './logo_White.png'
import bayaImg from './monogram_Colour.png'

const descriptors = {
  color: {
    'black': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "Black",
    },
    'white': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "White",
    },
    'yellow': {
      Change_Attribute_Event: true,
      Attribute_Key: "Color",
      Attribute_Value: "Metro_Exodus",
    }
  }
}

function AppUI (props) {
  const { emitUIInteraction } = props;

  function colorChange (event) {
    emitUIInteraction(descriptors.color[event?.target?.value])
  }
  
  return (<div className="buttons-block">
            <select onChange={colorChange}>
              {Object.keys(descriptors.color).map(v => (<option key={v}>{v}</option>))}
            </select>
          </div>);
}

function Responses (props) {
  const {responses} = props;

  return (<div className="responses-block">
    <h4>Response log from UE app:</h4>
    <div className="responses-list">
      {responses.map(v => <p>{v}</p>)}
    </div>
  </div>)
}

function App() {
  const sizeContainerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [webrtcClient, setWebrtcClient] = useState();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  let webrtcClientInit = false;

  const responseCallback = (message) => {
    console.log('response')
    setResponses([message, ...responses])
  }

  const videoInitialized = () => {
    console.log("jhjhjhjhjhjjhjhj")
    setIsLoading(false)
    if (webrtcClient) {
      webrtcClient.emitUIInteraction(descriptors.color.black);
    }
  }

  useEffect(() => {
    const args = {
      address: "wss://signalling-client.ragnarok.arcware.cloud/",
      packageId: "share-76-42f3-46e8-bb33-8911993449fb",
      settings: {},
      sizeContainer: sizeContainerRef.current,
      container: containerRef.current,
      videoRef: videoRef.current,
      forceVideoToFitContainer: true,
      playOverlay: false,
      loader: () => {},
      applicationResponse: responseCallback,
      videoInitializeCallback: videoInitialized
    };

    // double load protection
    if (!webrtcClientInit) { 
      webrtcClientInit = true;
      setWebrtcClient(new WebRTCClient(args));
    }
  }, [])

  return (
    <div className="App">
      {isLoading && <div className="content">
            <h1>Welcome to</h1>
            <div className='logos'>
              <img className='img1' src={bayaImg}/>
              <img className='img2' src={bayaLogo}/>
            </div>
          </div>}
      <div ref={sizeContainerRef}>
        <div ref={containerRef} style={{ zIndex: 1}}>
          <video ref={videoRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
