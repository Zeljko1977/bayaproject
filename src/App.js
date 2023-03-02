import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"

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
  let webrtcClientInit = false;

  const responseCallback = (message) => {
    setResponses([message, ...responses])
  }

  const videoInitialized = () => {
    if (webrtcClient) {
      webrtcClient.emitUIInteraction(descriptors.color.black);
    }
  }

  useEffect(() => {
    const args = {
      address: "wss://signalling-client.ragnarok.arcware.cloud/",
      packageId: "ff41fd0c-cac9-4e4c-abe5-3ada402f57cc",
      settings: {},
      sizeContainer: sizeContainerRef.current,
      container: containerRef.current,
      videoRef: videoRef.current,
      playOverlay: true,
      loader: () => {'Loading'},
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
      <div ref={sizeContainerRef}>
        <div ref={containerRef} style={{ zIndex: 1 }}>
          <video ref={videoRef} />
          <div className="content">
            <h1>Welcome</h1>
            <p>To my site.</p>
          </div>
          {webrtcClient != null && <AppUI emitUIInteraction={webrtcClient.emitUIInteraction} />}
          <Responses responses={responses} />
        </div>
      </div>
    </div>
  );
}

export default App;
