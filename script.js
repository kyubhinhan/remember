; (() => {
  'use strict'
  const get = (element) => { return document.querySelector(element) }
  const getAll = (element) => { return document.querySelectorAll(element) }

  const $subjectlist = get('.subjectlist');
  const $subjects = getAll('.subjectdisplay');
  const APIURL = 'http://localhost:3000/';
  const $pagination = get('.pagenation');
  const $AddSubjectbtn = get('.SubjectAddbtn');

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
  const pagination = async (add = 0) => {
    //total 자료의 갯수를 받아줌

    totalCount = await gettotalCount()
    totalCount = totalCount.length
    let totalPage = Math.ceil(totalCount / limit)
    let pageGroup = Math.ceil(currentPage / pageCount)
    let lastNumber = pageGroup * pageCount
    if (lastNumber > totalPage) {
      lastNumber = totalPage
    }
    let firstNumber = lastNumber > 5 ? lastNumber - (pageCount - 1) : 1
    if (add === 1) {
      currentPage = totalPage
    }
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
    SubjectElement.innerHTML = `
    <div class="subject">
    ${contents}
    </div>
    <div class="OpinionCount">
      <i class="fa-solid fa-shoe-prints"></i>
      : ${comments}
    </div>
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

  const addSubjectToServer = (e) => {
    e.preventDefault()
    const $subjecttextareaInput = get('.SubjectTextareaInput')
    const InputSubjectContents = $subjecttextareaInput.value
    if (!InputSubjectContents) return
    const subjects = {
      "contents": InputSubjectContents,
      "comments": 0
    }
    fetch(`${APIURL}subjects`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subjects),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error.message))
  }

  /**
   * 주제를 추가하는 함수
   * @param {event} e 
   */
  const addSubject = (e) => {
    const $AddSubjectPage = get('.addsubject')
    const $CancleSubjectPageBtn = get('.SubjectSubmitCancleBtn')
    const $AddSubjectForm = get('.subject_input')
    const $subjecttextareaInput = get('.SubjectTextareaInput')
    const $SubmitSubjectBtn = get('.SubjectSubmitBtn')
    $AddSubjectPage.classList.remove('hidden')
    //취소 버튼을 누르면 다시 hidden을 추가하여 가려줌
    e.preventDefault()
    $CancleSubjectPageBtn.addEventListener('click', (e) => {
      e.preventDefault()
      $AddSubjectPage.classList.add('hidden')
      $subjecttextareaInput.value = ''
      return
    })
    //키보드 'esc'를 눌러도 다시 hidden을 추가하여 가려줌
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      if (e.key === 'Escape') {
        $AddSubjectPage.classList.add('hidden')
        $subjecttextareaInput.value = ''
        return
      }
    })

    $AddSubjectForm.addEventListener('submit', (e) => {
      e.preventDefault()
      addSubjectToServer(e)
      pagination(1)
    })

  }

  const init = () => {
    getSubjects()
    pagination()
    $AddSubjectbtn.addEventListener('click', (e) => {
      addSubject(e)
    })
  }

  init()
})()