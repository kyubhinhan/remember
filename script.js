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
  const totalCount = 53
  const pageCount = 5
  const limit = 5 //한 페이지 당 최대 표시할 숫자

  /**
   * 페이지네이션을 위한 함수
   */
  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit)
    let pageGroup = Math.ceil(currentPage / pageCount)
    let lastNumber = pageGroup * pageCount
    if (lastNumber > totalPage) {
      lastNumber = totalPage
    }
    let firstNumber = lastNumber - (pageCount - 1)

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
   * 여기에 페이지 네이션을 적용시키면 될 것 같은데
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

  const addSubject = () => {
    console.log('hi')
  }

  const init = () => {
    getSubjects()
    pagination()
    $AddSubjectbtn.addEventListener('click', () => {
      addSubject()
    })
  }

  init()
})()