import * as React from 'react'
import { MapNode } from '../components/MapNode'
import { getFinalNodeTitle } from '../firestore/firestore'

export const MapQuestion = (props) => {
  const {
    question,
    currentQuestion,
    setMapDepth,
    setMaxMapDepth,
    setCurrentQuestion,
    questionChildren,
    questionIndex,
  } = props

  const [expandedChild, setExpandedChild] = React.useState(null)

  return (
    <>
      <li
        className="map-question"
        key={questionIndex}
        onClick={() => {
          setMapDepth(0)
          setCurrentQuestion(question.current._key)
        }}
      >
        <div className="knockout convo-count">
          <p>{Object.keys(questionChildren).length}</p>
          <p>Convos</p>
        </div>
        <div className="map-question-title">{getFinalNodeTitle(question)}</div>
      </li>
      {question.current._key == currentQuestion && (
        <ul className="question-children fade-in" key={`${questionIndex}-children`}>
          {Object.keys(questionChildren).map((childNodeKey) => {
            const childNode = questionChildren[childNodeKey]
            return (
              <MapNode
                nodeId={childNodeKey}
                title={childNode.title}
                nodeChildren={childNode.childNodes}
                depth={1}
                setMapDepth={setMapDepth}
                setMaxMapDepth={setMaxMapDepth}
                isExpanded={childNodeKey === expandedChild}
                setIsExpanded={() => {
                  setExpandedChild(childNodeKey)
                }}
                key={childNodeKey}
              />
            )
          })}
        </ul>
      )}
    </>
  )
}
