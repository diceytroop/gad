import * as React from 'react'
import { observer } from 'mobx-react'
import { getQuestions, getMapNodeSubtree, getFinalNodeTitle } from '../firestore/firestore'
import { MapQuestions } from '../components/MapQuestions'
import { TitleBlock } from '../components/TitleBlock'
import { MapDepthSelector } from '../components/MapDepthSelector'

import '../styles/Map.scss'

export const Map = observer((props) => {
  const { themeId } = props
  const questions = getQuestions()
  const questionChildren = questions.map((question) => ({
    questionId: question._key,
    childNodes: getMapNodeSubtree(question._key),
  }))

  const [mapDepth, setMapDepth] = React.useState(0)
  const [maxMapDepth, setMaxMapDepth] = React.useState(0)

  return (
    <main className="map fade-in" style={{ backgroundPositionX: `calc(100% - ${mapDepth * 30}px)` }}>
      <div className="top-container">
        <img
          className="title-image"
          src={require(`../assets/images/${themeId}-title-transparent.png`)}
          alt="The Covid Conversation"
        />
      </div>
      <section className="map-container" style={{ transform: `translateX(${-40 * mapDepth + 4}%)` }}>
        <div className="question-list-container">
          <MapQuestions
            questions={questions}
            questionChildren={questionChildren}
            setMapDepth={setMapDepth}
            setMaxMapDepth={setMaxMapDepth}
          />
        </div>
      </section>
      <section className="map-footer">
        <MapDepthSelector
          currentDepth={mapDepth}
          maxDepth={maxMapDepth}
          zeroMapDepth={() => setMapDepth(0)}
          decreaseMapDepth={() => {
            if (mapDepth > 0) {
              setMapDepth(mapDepth - 1)
            }
          }}
          increaseMapDepth={() => {
            if (mapDepth < maxMapDepth) {
              setMapDepth(mapDepth + 1)
            }
          }}
          maximizeMapDepth={() => setMapDepth(maxMapDepth)}
        />
      </section>
    </main>
  )
})