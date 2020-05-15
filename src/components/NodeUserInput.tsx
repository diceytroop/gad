/** @jsx jsx */
import { jsx, css } from '@emotion/core'

import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faThumbsUp, faThumbsDown, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

import { useTheme } from 'emotion-theming'
import { Theme } from '@emotion/types'
import { styles } from './NodeUserInput.style'
import { stylizedButton, dropShadow } from '../styles/shared.style'
import { request } from 'http'

export const NodeUserInput = (props) => {
  const { nodeId } = props

  const MIN_ITEM_LENGTH = 40

  const theme: Theme = useTheme()
  const s = styles(theme)

  const [inputIsExpanded, setInputIsExpanded] = React.useState(false)

  const [inputItems, setInputItems] = React.useState([''])
  const [currentInputItem, setCurrentInputItem] = React.useState('')
  const [currentInputItemIndex, setCurrentInputItemIndex] = React.useState(0)
  const [inputHeight, setInputHeight] = React.useState(0) //We need this to get the textarea to expand to match its <p> size.
  const [inputSubmitted, setInputSubmitted] = React.useState(false)

  const textareaRef = React.useRef(null)

  const formConfig = {
    // With help from https://stackoverflow.com/questions/51995070/post-data-to-a-google-form-with-ajax
    cors: 'https://cors-anywhere.herokuapp.com/', // <optional> doesn't display the cors error
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeNWSBBbyZnS9IGOZxh9bEacjEuP11SA1NFwhG2doalRCK9_w/formResponse?',
  }

  React.useEffect(() => {
    if (!textareaRef || !textareaRef.current) return
    setInputHeight(textareaRef.current.scrollHeight)
  }, [currentInputItem, currentInputItemIndex])

  const inputTextChanged = (event) => {
    setCurrentInputItem(event.target.value)
  }

  const createNewInputItem = () => {
    if (currentInputItem.length < MIN_ITEM_LENGTH) {
      //Show a requirements message
      return
    }
    setInputItems(inputItems.concat(currentInputItem))
    setCurrentInputItem('')
  }

  const changeCurrentInputItemIndex = (itemIndex) => {
    if (currentInputItemIndex === 0) {
      createNewInputItem()
    } else {
      let updatedInputItems = inputItems.slice()
      if (currentInputItem === '') {
        updatedInputItems.splice(currentInputItemIndex, 1)
      } else {
        updatedInputItems[currentInputItemIndex] = currentInputItem
      }
      setInputItems(updatedInputItems)
    }

    setCurrentInputItem(inputItems[itemIndex])
    setCurrentInputItemIndex(itemIndex)
  }

  const submitUserInput = async (forOrAgainst) => {
    const argumentId = Math.floor(Math.random() * 100000000000000000) //Random one-time ID to group the claims together
    const now = new Date()
    const timestamp = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()

    inputItems.forEach(async (claim) => {
      if (claim.length < MIN_ITEM_LENGTH) {
        return
      }

      const inputs = {
        claimId: { id: 'entry.1356714542', value: nodeId },
        argumentId: { id: 'entry.1531525675', value: argumentId },
        forOrAgainst: { id: 'entry.394432412', value: forOrAgainst },
        claim: { id: 'entry.2014411862', value: claim },
        timestamp: { id: 'entry.1370532301', value: timestamp },
      }

      let requestUrl = formConfig.formUrl

      Object.keys(inputs).forEach((key) => {
        requestUrl += `${inputs[key].id}=${inputs[key].value}&`
      })

      requestUrl += 'submit=Submit'

      await axios({
        url: encodeURI(requestUrl),
        method: 'get',
        contentType: 'application/x-www-form-urlencoded',
        responseType: 'json',
      })
        .then((response) => {
          console.log('response', response)
        })
        .catch((err) => {
          console.log('err', err)
        })

      setInputItems([''])
      setInputSubmitted(true)
    })
  }

  return (
    <>
      <h4
        onClick={() => {
          setInputIsExpanded(!inputIsExpanded)
        }}
        key="userInputHeading"
      >
        Send us your input and evidence{' '}
        {inputIsExpanded ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
      </h4>
      {inputIsExpanded && (
        <>
          <p key="userInputIntro">
            {inputSubmitted
              ? 'Thank you for your submission. You can send more replies if you like.'
              : 'Try to break your argument into simple, small pieces. Include links to sources where possible.'}
          </p>
          {inputItems.map((item, itemIndex) => {
            if (itemIndex === currentInputItemIndex) {
              return (
                <>
                  <div key={itemIndex} css={s.newInputItemContainer}>
                    <textarea
                      ref={textareaRef}
                      placeholder="I think that..."
                      onChange={(event) => {
                        inputTextChanged(event)
                      }}
                      value={currentInputItem}
                      style={{ height: inputHeight }}
                      key="userInputTextarea"
                    />
                    {currentInputItem.length > MIN_ITEM_LENGTH &&
                      (inputItems.indexOf('') === itemIndex || !inputItems.includes('')) && (
                        <button css={s.newInputItemButton} onClick={createNewInputItem} key="userInputNewItemButton">
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                  </div>
                </>
              )
            } else {
              return (
                <p
                  onClick={() => {
                    changeCurrentInputItemIndex(itemIndex)
                  }}
                  css={[s.inputItem, dropShadow(theme)]}
                  key={itemIndex}
                >
                  {item || 'I think that...'}
                </p>
              )
            }
          })}
          <div css={s.inputSubmitRow} key="inputDetailsSubmitRow">
            <button
              css={stylizedButton(theme)}
              onClick={() => {
                submitUserInput('Against')
              }}
            >
              <FontAwesomeIcon icon={faThumbsDown} /> Argue against
            </button>
            <button
              css={stylizedButton(theme)}
              onClick={() => {
                submitUserInput('For')
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> Argue for
            </button>
          </div>
        </>
      )}
    </>
  )
}