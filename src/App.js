import "./App.css";
import googleApiResponse from "./googleApiResponse.json";
import React, { useEffect, useState, useRef } from "react";
import Graph from "./Graph";

function App() {
  const [GraphElements, setGraphElements] = useState([]);
  const [dependancy, setDependancy] = useState(true);
  const [label, setLabel] = useState(true);
  const [partOfSpeech, setPartOfSpeech] = useState(true);
  const [morphology, setMorphology] = useState(true);
  const [lemma, setLemma] = useState(true);

  useEffect(() => {
    const copy = JSON.parse(JSON.stringify(googleApiResponse));
    const { tokens, sentences } = copy;

    let sentenceStartIndexArray = [];

    sentences.forEach((sentence) => {
      tokens.forEach((token, index) => {
        if (token["text"]["beginOffset"] === sentence["text"]["beginOffset"]) {
          sentenceStartIndexArray.push(index);
        }
      });
    });

    sentenceStartIndexArray = sentenceStartIndexArray.sort();

    const GraphElementArray = sentenceStartIndexArray.map(
      (sentenceStartIndex, index) => {
        const sentenceEndtIndex = sentenceStartIndexArray[index + 1] ?? -1;
        const tokenData = tokens.slice(sentenceStartIndex, sentenceEndtIndex);

        tokenData.forEach((token) => {
          token["dependencyEdge"]["headTokenIndex"] =
            token["dependencyEdge"]["headTokenIndex"] - sentenceStartIndex;
        });

        return (
          <Graph
            key={index}
            tokens={tokenData}
            showDependancy={dependancy}
            showLemma={lemma}
            showLabel={label}
            showPartOfSpeech={partOfSpeech}
            showMorphology={morphology}
          ></Graph>
        );
      }
    );

    setGraphElements(GraphElementArray);
  }, [googleApiResponse, label, lemma, dependancy, morphology, partOfSpeech]);



  return (
    <div className="App">
      <div className="checkbox-input">
        <input
          type="checkbox"
          id="dependancy"
          name="dependancy"
          onChange={(e) => {
            setDependancy(e.target.checked);
          }}
          checked={dependancy}
        />
        <label for="dependancy"> Dependancy </label>
        <input
          type="checkbox"
          id="label"
          name="label"
          onChange={(e) => {
            setLabel(e.target.checked);
          }}
          checked={label}
        />
        <label for="label"> Parser Label </label>
        <input
          type="checkbox"
          id="partOfSpeech"
          name="partOfSpeech"
          onChange={(e) => {
            setPartOfSpeech(e.target.checked);
          }}
          checked={partOfSpeech}
        />
        <label for="partOfSpeech"> Part of Speech </label>
        <input
          type="checkbox"
          id="lemma"
          name="lemma"
          onChange={(e) => {
            setLemma(e.target.checked);
          }}
          checked={lemma}
        />
        <label for="lemma"> Lemma </label>
        <input
          type="checkbox"
          id="morphology"
          name="morphology"
          onChange={(e) => {
            setMorphology(e.target.checked);
          }}
          checked={morphology}
        />
        <label for="morphology"> Morphology </label>
      </div>
      <div className="graph-container">{GraphElements}</div>
    </div>
  );
}

export default App;
