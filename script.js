; (() => {
  'use strict'
  const get = (element) => { return document.querySelector(element) }
  const getAll = (element) => { return document.querySelectorAll(element) }

  const $subjectlist = get('.subjectlist');
  const $subjects = getAll('.subjectdisplay');
  const APIURL = 'http://localhost:3000/';
  const $pagination = get('.pagenation');
  const $AddSubjectbtn = get('.SubjectAddbtn');
  const $AddSubjectPage = get('.addsubject')
  const $subjecttextareaInput = get('.SubjectTextareaInput')
  const $subjectDeleteBtns = getAll('.SubjectDeleteBtn')

  let currentPage = 1
  let totalCount
  const pageCount = 5
  const limit = 5 //한 페이지 당 최대 표시할 숫자

  const gettotalCount = () => {
    let result = fetch(`${APIURL}subjects`)
      .then(response => response.json())
    return result
  }
  /**
   * 페이지네이션을 위한 함수
   */
  const pagination = async () => {
    totalCount = await gettotalCount()
    totalCount = totalCount.length
    let totalPage = Math.ceil(totalCount / limit) //6
    let pageGroup = Math.ceil(currentPage / pageCount) //2
    let lastNumber = pageGroup * pageCount //10
    if (lastNumber > totalPage) {
      lastNumber = totalPage //6
    }
    let firstNumber = limit * (pageGroup - 1) + 1
    const next = lastNumber + 1
    const prev = firstNumber - 1
    let html = ''

    if (prev > 0) {
      html += "<button class='pagebtn' data-fn='prev'>이전</button> "
    }

    for (let i = firstNumber; i <= lastNumber; i++) {
      html += `<button class="pagebtn" id="page_${i}">${i}</button>`
    }
    if (lastNumber < totalPage) {
      html += `<button class='pagebtn' data-fn='next'>다음</button>`
    }

    $pagination.innerHTML = html
    const $currentPageNumber = get(`.pagebtn#page_${currentPage}`)
    $currentPageNumber.classList.add('focus')

    const $currentPageNumbers = getAll(`.pagebtn`)
    $currentPageNumbers.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.fn === 'prev') {
          currentPage = prev
        } else if (button.dataset.fn === 'next') {
          currentPage = next
        } else {
          currentPage = button.innerText
        }
        pagination()
        getSubjects()
      })
    })
  }
  /**
   * 주제들을 받아와서 subjectdisplay element를 만들어주는 함수
   */
  const CreateSubjectElement = (subject) => {
    const { id, contents, comments } = subject
    let SubjectElement = document.createElement('li')
    SubjectElement.classList.add('subjectdisplay')
    SubjectElement.dataset.key = id
    SubjectElement.innerHTML = `
    <div class="subject">
    ${contents}
    </div>
    <div class="OpinionCount">
      <i class="fa-solid fa-shoe-prints"></i>
      : ${comments}
    </div>
    <button class="SubjectDeleteBtn">
      <i class="fa-solid fa-xmark"></i>
    </button>
    `
    return SubjectElement
  }
  /**
   * 서버와 연동하여, 주제들을 가져와 표시해주는 함수
   */
  const getSubjects = () => {
    $subjectlist.innerHTML = ''
    fetch(`${APIURL}subjects?_page=${currentPage}&_limit=${limit}`)
      .then((response) => response.json())
      .then((subjects) => subjects.forEach(subject => {
        const SubjectElement = CreateSubjectElement(subject)
        $subjectlist.appendChild(SubjectElement)
      }))
      .catch((error) => console.error(error))
  }
  const addSubjectToServer = () => {
    const $subjecttextareaInput = get('.SubjectTextareaInput')
    const InputSubjectContents = $subjecttextareaInput.value
    console.log(InputSubjectContents)
    if (InputSubjectContents === '') return
    const subjects = {
      "contents": InputSubjectContents,
      "comments": 0
    }
    hideSubjectInput()
    fetch(`${APIURL}subjects`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subjects),
    })
      .then((response) => response.json())
      .then((result) => {
        pagination()
        getSubjects()
      })
      .catch((error) => console.error(error.message))
  }
  /**
   * 주제를 추가하는 함수
   * @param {event} e 
   */
  const addSubject = (e) => {
    const $SubmitSubjectBtn = get('.SubjectSubmitBtn')
    const $CancleSubjectPageBtn = get('.SubjectSubmitCancleBtn');
    $AddSubjectPage.classList.remove('hidden')

    //취소 버튼을 누르면 다시 hidden을 추가하여 가려줌
    $CancleSubjectPageBtn.addEventListener('click', (e) => {
      e.preventDefault()
      hideSubjectInput()
    })
    //키보드 'esc'를 눌러도 다시 hidden을 추가하여 가려줌
    //키보드 'enter'를 누르면 제출되도록 함
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        console.log('hi')
        hideSubjectInput()
      }
      if (e.key === 'Enter') {
        addSubjectToServer()
      }
    })
    $SubmitSubjectBtn.addEventListener('click', addSubjectToServer)
  }

  const hideSubjectInput = () => {
    $AddSubjectPage.classList.toggle('hidden', true)
    $subjecttextareaInput.value = ''
  }

  //주제 삭제해주는 함수
  const deletesubject = (e) => {
    if (Array.from(e.target.classList).includes('SubjectDeleteBtn') || Array.from(e.target.classList).includes('fa-xmark')) {
      const $subjectdisplay = e.target.closest('.subjectdisplay')
      const id = $subjectdisplay.dataset.key
      fetch(`${APIURL}subjects/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(getSubjects)
        .catch((error) => console.error(error.message))
    }
  }
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getSubjects()
      pagination()
    })
    console.log('hi')

    //주제 추가해줌
    $AddSubjectbtn.addEventListener('click', addSubject)

    //주제 삭제해주기
    $subjectlist.addEventListener('click', (e) => {
      deletesubject(e)
    })
  }

  init()
})()