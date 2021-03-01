import React, {useState, useEffect, useRef} from "react";
import './App.css';

import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const App = () => {

  // Set up state hooks
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // Load Tensorflow model
  const loadModel = async () => {
    const loadedModel = await qna.load()
    setModel(loadedModel);
    console.log("Model loaded");
  }
  useEffect(()=>{loadModel()}, [])

  // Handle Questions
  const answerQuestion = async (e) => {
    if (e.which === 13 & model !== null) {
      console.log("Question submitted");
      const passage = passageRef.current.value;
      const question = questionRef.current.value;
      const answers = await model.findAnswers(question, passage);
      setAnswer(answers);
      console.log(answers);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
          {model === null ? 
            <>
              <h1>Model Loading</h1>
              <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}/>
            </>  
            :
            <>
              <h2>Passage</h2>
              <textarea ref={passageRef} rows="30" cols="100"></textarea>
              <h2>Ask a Question</h2>
              <input ref={questionRef} onKeyPress={answerQuestion} size="80"></input>
              <h2>Answers</h2>
              <section>
                {answer ? answer.map((ans, idx) => (
                  <div>
                    <span className="floatLeft marginRight"><strong>Answer {idx + 1}:</strong> {ans.text}</span>
                    <span className="floatRight"><strong>Score:</strong> {Math.floor(ans.score*100)/100}</span>
                  </div>
                )): null}
              </section>
            </>
        }

      </header>
    </div>
  );
}

export default App;