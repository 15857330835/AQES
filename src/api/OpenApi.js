/* eslint-disable no-undef */
import axios from 'axios'
const defaultPayload = {
  expires: NCES.expires,
  signature_nonce: NCES.signature_nonce,
  signature: NCES.signature,
  access_id: NCES.access_id
}
export const openapiCreateProjectApi = (payload = {}) => {
  return axios.post('/openapi/NCES.CreateProject', JSON.stringify(payload))
}
export const openapiCheckProjectAppApi = (payload = {}) => {
  return axios.post('/openapi/NCES.CheckProjectApp', JSON.stringify(payload))
}
export const openapiAudioList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.AudioList',
    JSON.stringify(newPayload)
  )
}
export const openapiAudioSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.AudioSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiTextList = (fixedPayload, payload = {}) => {
  // console.log('be touched')
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.TextList',
    JSON.stringify(newPayload)
  )
}
export const openapiTextSearch = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.TextSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiTextTemplateList = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.GetTextTemplateList',
    JSON.stringify(newPayload)
  )
}
export const openapiTextTemplateSearch = (fixedPayload, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, fixedPayload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.SearchTextTemplate',
    JSON.stringify(newPayload)
  )
}
export const openapiFontList = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.FontList',
    JSON.stringify(newPayload)
  )
}
export const openapiImageList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.ImageList',
    JSON.stringify(newPayload)
  )
}
export const openapiImageSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.ImageSearch',
    JSON.stringify(newPayload)
  )
}
export const openapiVideoList = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, {
    category
  })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.VideoList',
    JSON.stringify(newPayload)
  )
}
export const openapiVideoSearch = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, {
    category
  })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.VideoSearch',
    JSON.stringify(newPayload)
  )
}

export const openapiAudioCategory = (category, payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload, { category })
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.AudioCategory',
    JSON.stringify(newPayload)
  )
}
export const openapiImageCategory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.ImageCategory',
    JSON.stringify(newPayload)
  )
}
export const openapiTextCategory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.TextCategory',
    JSON.stringify(newPayload)
  )
}

export const openapiVideoHistory = (payload = {}) => {
  const newPayload = Object.assign(defaultPayload, payload)
  return axios.post(
    '//openapi.aodianyun.com/v3/NCES.VideoHistory',
    JSON.stringify(newPayload)
  )
}
