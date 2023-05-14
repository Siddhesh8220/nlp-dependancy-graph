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

      //calculating td midpoint for edgeFromElement
      let edgeFromTdElementX = edgeFromTdElement?.offsetLeft + edgeFromTdElement.clientWidth / 2; 
      let edgeFromTdElementY = canvasHeight - 5;

      //calculating td midpoint for edgeToElement
      let edgeToTdElementX = edgeToTdElement?.offsetLeft + edgeToTdElement.clientWidth / 2; 
      let edgeToTdElementY = canvasHeight - 5;

      let bezierCurveMidpointOneX = 0;
      let bezierCurveMidpointOneY = 0;
      let bezierCurveMidpointTwoX = 0;
      let bezierCurveMidpointTwoY = 0;

      // edge going to right
      if (edgeFromTdElementX < edgeToTdElementX) {
        edgeToTdElementX -= 10;
        bezierCurveMidpointOneX = edgeFromTdElementX + (Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/60);
        bezierCurveMidpointTwoX = edgeToTdElementX - (Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/60);
      } else {
        // edge going to left
        edgeToTdElementX += 10;
        bezierCurveMidpointOneX = edgeFromTdElementX - (Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/60);
        bezierCurveMidpointTwoX = edgeToTdElementX + (Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/60);
      }

      let calculatedCurveMidPointOneY = Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/4
      if(calculatedCurveMidPointOneY > canvasHeight) bezierCurveMidpointOneY = 0
      else bezierCurveMidpointOneY =  Math.abs(canvasHeight - calculatedCurveMidPointOneY)

      let calculatedCurveMidPointTwoY = Math.abs(edgeFromTdElementX - edgeToTdElementX) * 1/4
      if(calculatedCurveMidPointTwoY > canvasHeight) bezierCurveMidpointTwoY = 0
      else bezierCurveMidpointTwoY =  Math.abs(canvasHeight - calculatedCurveMidPointTwoY)

      // Drawing curve edges
      if (canvasNode.getContext) {

        const ctx = canvasNode.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(edgeFromTdElementX, edgeFromTdElementY);
        ctx.bezierCurveTo(
          bezierCurveMidpointOneX,
          bezierCurveMidpointOneY,
          bezierCurveMidpointTwoX,
          bezierCurveMidpointTwoY,
          edgeToTdElementX,
          edgeToTdElementY
        );
        ctx.stroke();

        // Drawing arrowhead
        ctx.beginPath()
        ctx.moveTo(edgeFromTdElementX, edgeFromTdElementY);
        ctx.lineTo(edgeFromTdElementX - 4, edgeFromTdElementY)
        ctx.lineTo(edgeFromTdElementX, edgeFromTdElementY + 4)
        ctx.lineTo(edgeFromTdElementX + 4, edgeFromTdElementY)
        ctx.fill()
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
