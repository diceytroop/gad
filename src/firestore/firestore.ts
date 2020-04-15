import { StoreAccessor } from 'mobx-firelink'
import { GetNodeChildrenL2, GetNodeChildren } from '@debate-map/server-link'
import { MapNodeL2 } from '@debate-map/server-link'

export function getFinalNodeTitle(node: MapNodeL2) {
  //if (node == null) return "";
  let result = node.current.titles.base
  // in the GAD client/ui, replace "CC" with the full "Climate Change"
  result = result.replace(/(^|\W)CC(\W|$)/g, '$1Climate Change$2')
  return result
}

export const getQuestions = StoreAccessor((s) => () => {
  let mainMap_rootNodeID
  let mainMapID

  switch (process.env.REACT_APP_PROJECT_ID) {
    case 'great-american-debate': {
      // uuid of the root Climate Change debate map, and its root node
      mainMapID = 'DjedFbxfS2-ImEsHDiZNiA'
      mainMap_rootNodeID = 'v3RJAZH0Tr-nUjjvKd_39g'
      break
    }
    case 'covid-conversation': {
      mainMapID = 'ccrlooCVR2Cu8AMpsrDIlw'
      mainMap_rootNodeID = '3Ip9uqwURvOFO0DkMKGO4w'
      break
    }
  }

  const questions = GetNodeChildrenL2(mainMap_rootNodeID)
  questions.sort((a, b) => a.createdAt - b.createdAt) // until we have a way to manually specify the order, use node creation-time
  return questions
})

/**
 * Page-level queries
 */
export const getQuestionPositions = StoreAccessor((s) => (questionID: string) => {
  return GetNodeChildrenL2(questionID)
})

export const getPositionReasons = StoreAccessor((s) => (positionID: string) => {
  return GetNodeChildrenL2(positionID)
})

export const getReasonEvidence = StoreAccessor((s) => (reasonID: string) => {
  return GetNodeChildrenL2(reasonID)
})

/**
 * Map queries
 */

export const getMapNodeChildren = StoreAccessor((s) => (nodeId: string) => {
  return GetNodeChildrenL2(nodeId)
})

export const getMapNodeSubtree = StoreAccessor((s) => (nodeId: string) => {
  let subtree = {}
  let children = getMapNodeChildren(nodeId)

  children.forEach((child) => {
    subtree[child._key] = {
      title: child.current.titles.base,
      childNodes: getMapNodeSubtree(child._key),
    }
  })

  return subtree
})