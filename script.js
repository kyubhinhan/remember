; (() => {
  'use strict'

  const get = (element) => { return document.querySelector(element) }

  const $rightBtn = get('.right_button')
  const $leftBtn = get('.left_button')
  const $aside = get('.preSubmission')

  const asideState = () => {
    $aside.classList.toggle('active')
    $leftBtn.classList.toggle('active')
  }

  $rightBtn.addEventListener('click', () => {
    asideState()
  })

  $leftBtn.addEventListener('click', () => {
    asideState()
  })

})()