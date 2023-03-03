import './App.css';
import {useRef, useEffect, useState} from 'react';
import { WebRTCClient } from "@arcware/webrtc-plugin"
import ReactTextTransition, { presets } from "react-text-transition";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import bayaLogo from './logo_White.png'
import bayaImg from './monogram_Colour.png'
import * as Icon from 'react-bootstrap-icons';

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

const paragraphs = [
  "Loading resources",
  "Loading textures",
  "Optimizing performace"
];

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
  const [videoDelay, setVideoDelay] = useState(true)
  const [paragraphIndex, setParagraphIndex] = useState(0)
  let webrtcClientInit = false;

  const handle = useFullScreenHandle();

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
    const intervalId = setInterval(() =>
       setParagraphIndex(index=>{
        if(index===2) {
          return index;
        } else {
          return index+1;
        }
        }),
      700 // every 3 seconds */
    );
   // baya animation "share-76-42f3-46e8-bb33-8911993449fb"
    const args = {
      address: "wss://signalling-client.ragnarok.arcware.cloud/",
      packageId: "ff41fd0c-cac9-4e4c-abe5-3ada402f57cc",
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
    
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className="App">
      {isLoading &&
        <div className="content">
          <div className='content-animation'>
            <h1>Welcome to</h1>
            <div className='logos'>
              <img className='img1' src={bayaImg}/>
              <img className='img2' src={bayaLogo}/>
            </div>
          </div>
            <section>
            <ReactTextTransition
              children={paragraphs[paragraphIndex % paragraphs.length]}
              springConfig={presets.gentle}
              className="big"
            />
          </section>

        </div>
          
        }<FullScreen handle={handle}>
        <div ref={sizeContainerRef}>
        <div ref={containerRef} style={{ zIndex: 1}}>
          <video ref={videoRef} />
        </div>
      </div>
      
      
      {!handle.active &&<Icon.Fullscreen size={35} color={'white'} onClick={handle.enter} className='full-screen-button'/>}
      {handle.active &&<Icon.FullscreenExit size={35} color={'white'} onClick={handle.exit} className='full-screen-button'/>}
      </FullScreen>
      
    </div>
  );
}

export default App;
