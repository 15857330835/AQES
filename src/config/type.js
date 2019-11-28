const trackType = {
  VIDEO: 1,
  AUDIO: 2
}

const chunkType = {
  VIDEO: 1,
  AUDIO: 2,
  TEXT: 3,
  IMG: 4,
  TRANSITION: 5
}
const chunkMode = {
  NORMAL: 0,
  COVER: 1,
  INSERT: 2
}

const filterType = {
  VIDEO: 1,
  TEXT: 2,
  IMG: 3,
  AUDIO: 4
}

const historyType = {
  CHUNK: 1,
  TRACK: 2
}

const sourceType = {
  MEDIA: 1,
  TEXT: 2,
  IMG: 3
}

const loadingStatus = {
  LOADING: 1,
  FAILED: 2,
  LOADED: 3
}
export {
  trackType,
  chunkType,
  filterType,
  historyType,
  sourceType,
  chunkMode,
  loadingStatus
}
