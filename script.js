; (() => {
  'use strict'

  const get = (element) => { return document.querySelector(element) }

  const $rightBtn = get('.right_button')
  const $leftBtn = get('.left_button')
  const $aside = get('.preSubmission')
  const $subject = get('.subject')
  const API_URL = 'http://localhost:3000/comments'
  const $formInput = get('.form_input')
  const $formBtn = get('.submit_btn')


  const asideState = () => {
    $aside.classList.toggle('active')
    $leftBtn.classList.toggle('active')
  }

  //데이터 받아올 때 사용할 수 있음
  const getComments = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((result) => result.reverse().forEach((item) => {
        const element = makeprevElement(item)
        $aside.appendChild(element)
      }))
      .catch((error) => console.error(error.message))
  }

  const makeprevElement = (item) => {
    const { id, date, body } = item
    const newdate = new Date(date)
    const $prev = document.createElement('div')
    $prev.classList.add('prev')
    $prev.dataset.id = id
    $prev.innerHTML = `
    <div class="preDate">${newdate.getFullYear()}년 ${newdate.getMonth()}월 ${newdate.getDate()}일</div>
    <div class="preContent">${body}</div>
    `
    return $prev
  }

  const addComment = (value) => {
    const body = value
    const date = Date.now()
    const comment = {
      body,
      date
    }
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(comment),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message))
  }

  const addValue = (e) => {
    e.preventDefault() //새로 고침 멈출 수 있음
    const $textarea = get('.formTextarea')
    const InputValue = $textarea.value
    $textarea.value = '' //입력창 초기화
    $textarea.focus() //입력창에 바로 입력할 수 있도록 함
    addComment(InputValue) //json-server에 값을 추가함
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getComments()
    })
    $rightBtn.addEventListener('click', () => asideState())
    $leftBtn.addEventListener('click', () => asideState())
    $formInput.addEventListener('submit', (e) => {
      addValue(e)
    })
  }

  init()

})()