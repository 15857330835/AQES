/* eslint-disable no-undef */
import axios from 'axios'
const defaultPayload = {
  expires: AQES.expires,
  signature_nonce: AQES.signature_nonce,
  signature: AQES.signature,
  access_id: AQES.access_id
}
export const openapiCreateProjectApi = (payload = {}) => {
  return axios.post('/openapi/AQES.CreateProject', JSON.stringify(payload))
}
export const openapiCheckProjectAppApi = (payload = {}) => {
  return axios.post('/openapi/AQES.CheckProjectApp', JSON.stringify(payload))
}
export const openapiAudioList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.AudioList',
    JSON.stringify(newPayload)
  )
}
export const openapiAudioSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.AudioSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiTextList = (fixedPayload, payload = {}) => {
  // console.log('be touched')
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.TextList',
    JSON.stringify(newPayload)
  )
}
export const openapiTextSearch = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.TextSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiTextTemplateList = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.GetTextTemplateList',
    JSON.stringify(newPayload)
  )
}
export const openapiTextTemplateSearch = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.SearchTextTemplate',
    JSON.stringify(newPayload)
  )
}
export const openapiFontList = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.FontList',
    JSON.stringify(newPayload)
  )
}
export const openapiImageList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.ImageList',
    JSON.stringify(newPayload)
  )
}
export const openapiImageSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.ImageSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiVideoList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, {
    category
  })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.VideoList',
    JSON.stringify(newPayload)
  )
}
export const openapiVideoSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, {
    category
  })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.VideoSearch',
    JSON.stringify(newPayload)
  )
}

export const openapiAudioCategory = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.AudioCategory',
    JSON.stringify(newPayload)
  )
}
export const openapiImageCategory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.ImageCategory',
    JSON.stringify(newPayload)
  )
}
export const openapiTextCategory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.TextCategory',
    JSON.stringify(newPayload)
  )
}

export const openapiVideoHistory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/AQES.VideoHistory',
    JSON.stringify(newPayload)
  )
}
