import React, { useEffect, useState, useRef } from "react";

function Graph({
  tokens = [],
  showDependancy = true,
  showLemma = true,
  showLabel = true,
  showPartOfSpeech = true,
  showMorphology = true,
}) {
  const [tableRows, setTableRows] = useState([]);
  const canvasRef = useRef();
  const tableRef = useRef();
  const canvasHeight = 150;

  useEffect(() => {
    let labelRow = (
      <tr>
        {tokens.map((token, index) => {
          return <td key={index}>{token["dependencyEdge"]["label"]}</td>;
        })}
      </tr>
    );

    let contentRow = (
      <tr>
        {tokens.map((token, index) => {
          return <td key={index}>{token["text"]["content"]}</td>;
        })}
      </tr>
    );

    let partoFSpeechRow = (
      <tr>
        {tokens.map((token, index) => {
          return <td key={index}>{token["partOfSpeech"]["tag"]}</td>;
        })}
      </tr>
    );

    let lemmaRow = (
      <tr>
        {tokens.map((token, index) => {
          return <td key={index}>{token["lemma"]}</td>;
        })}
      </tr>
    );

    let morphologyRow = (
      <tr>
        {tokens.map((token, index) => {
          return <td key={index}>{token["partOfSpeech"]["number"]}</td>;
        })}
      </tr>
    );

    setTableRows(
      <React.Fragment>
        {showLabel && labelRow}
        {contentRow}
        {showPartOfSpeech && partoFSpeechRow}
        {showLemma && lemmaRow}
        {showMorphology && morphologyRow}
      </React.Fragment>
    );
  }, [tokens]);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;
    const tableNode = tableRef.current;

    // set canvas width size based on the size of table
    canvasNode.width = tableNode?.clientWidth;
    canvasNode.height = canvasHeight;

    // get td nodes (array) for the first row in the table
    const tableBodyNode = tableNode.firstChild;
    const firstTableRowNode = tableBodyNode?.firstChild ?? null;
    const firstRowTableDataNodes = firstTableRowNode?.children;

    if (!firstRowTableDataNodes) return;

    tokens.map((token, index) => {
      const edgeToTdElementIndex = token["dependencyEdge"]["headTokenIndex"];

      const edgeFromTdElement = firstRowTableDataNodes[index];
      const edgeToTdElement = firstRowTableDataNodes[edgeToTdElementIndex];

      let edgeFromTdElementX =
        edgeFromTdElement?.offsetLeft + edgeFromTdElement.clientWidth / 2; //calculating td midpoint for edgeFromElement
      let edgeFromTdElementY = canvasHeight - 10;

      let edgeToTdElementX =
        edgeToTdElement?.offsetLeft + edgeToTdElement.clientWidth / 2; //calculating td midpoint for edgeToElement
      let edgeToTdElementY = canvasHeight - 10;

      let quadraticCurveMidpointX = 0;
      let quadraticCurveMidpointY = 0;
      let bexierCurveMidpointOneX = 0;
      let bexierCurveMidpointOneY = 0;
      let bexierCurveMidpointTwoX = 0;
      let bexierCurveMidpointTwoY = 0;

      // edge going to right
      if (edgeFromTdElementX < edgeToTdElementX) {
        edgeToTdElementX -= 10;
        quadraticCurveMidpointX =
          edgeFromTdElementX +
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 2;
        bexierCurveMidpointOneX =
          edgeFromTdElementX +
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 15;
        bexierCurveMidpointTwoX =
          edgeToTdElementX -
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 15;
      } else {
        // edge going to left
        edgeToTdElementX += 10;
        quadraticCurveMidpointX =
          edgeToTdElementX +
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 2;
        bexierCurveMidpointOneX =
          edgeFromTdElementX -
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 15;
        bexierCurveMidpointTwoX =
          edgeToTdElementX +
          Math.abs(edgeFromTdElementX - edgeToTdElementX) / 15;
      }

      quadraticCurveMidpointY = Math.abs(
        canvasHeight - (1 / 4) * Math.abs(edgeFromTdElementX - edgeToTdElementX)
      );
      if (quadraticCurveMidpointY > canvasHeight) quadraticCurveMidpointY = 0;
      else quadraticCurveMidpointY = quadraticCurveMidpointY - 10;

      bexierCurveMidpointOneY = Math.abs(
        canvasHeight - (1 / 4) * Math.abs(edgeFromTdElementX - edgeToTdElementX)
      );
      if (bexierCurveMidpointOneY > canvasHeight) bexierCurveMidpointOneY = 0;
      else bexierCurveMidpointOneY = bexierCurveMidpointOneY - 10;

      bexierCurveMidpointTwoY = Math.abs(
        canvasHeight - (1 / 4) * Math.abs(edgeFromTdElementX - edgeToTdElementX)
      );
      if (bexierCurveMidpointTwoY > canvasHeight) bexierCurveMidpointTwoY = 0;
      else bexierCurveMidpointTwoY = bexierCurveMidpointTwoY - 10;

      // Drawing curve edges
      if (canvasNode.getContext) {
        const ctx = canvasNode.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(edgeFromTdElementX, edgeFromTdElementY);
        ctx.bezierCurveTo(
          bexierCurveMidpointOneX,
          bexierCurveMidpointOneY,
          bexierCurveMidpointTwoX,
          bexierCurveMidpointTwoY,
          edgeToTdElementX,
          edgeToTdElementY
        );
        ctx.stroke();
      }
    });
  }, [tableRows, showLabel, showLemma, showMorphology, showPartOfSpeech]);

  return (
    <div>
      {showDependancy && <canvas ref={canvasRef}></canvas>}
      <table ref={tableRef} border={1}>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default Graph;
