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
  const $OpinionPage = get('.OpinionPage')


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
    <div class="subject" data-key="${id}">
    ${contents}
    </div>
    <div class="OpinionCount">
      <i class="fa-solid fa-shoe-prints"></i>
      : ${comments.length}
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
  const addSubjectToServer = (e) => {
    e.preventDefault()
    const $subjecttextareaInput = get('.SubjectTextareaInput')
    const InputSubjectContents = $subjecttextareaInput.value
    console.log(InputSubjectContents)
    if (InputSubjectContents === '') {
      hideSubjectInput()
      return
    }
    const subjects = {
      "contents": InputSubjectContents,
      "comments": []
    }
    fetch(`${APIURL}subjects`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(subjects),
    })
      .then((response) => response.json())
      .then(getSubjects)
      .then(hideSubjectInput)
      .catch((error) => console.log(error))
  }
  /**
   * 주제를 추가하는 함수
   * @param {event} e 
   */
  const addSubject = (e) => {
    const $CancleSubjectPageBtn = get('.SubjectSubmitCancleBtn');
    const $SubmitSubjectBtn = get('.SubjectSubmitBtn')

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
        hideSubjectInput()
      }
      if (e.key === 'Enter') {
        addSubjectToServer(e)
      }
    })
    $SubmitSubjectBtn.addEventListener('click', addSubjectToServer)
  }
  /**
   * 주제 입력창을 가리는 함수
   */
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
        .then(() => {
          console.log(currentPage)
          pagination()
          getSubjects()
        })
        .catch((error) => console.error(error.message))
    }
  }

  //key를 id로 가진 subject만 서버에서 받아오는 함수
  const getSubject = async(key)=>{
    //async는 무조건 promise를 반환한다..
    try{
      let response = await (await fetch(`${APIURL}subjects/${key}`)).json()
      return response
    } catch(err){
      console.log(err)
    }
  }

  //Opinion page element를 만들어주는 함수
  const createOpinionpageelement = (subject)=>{
    let {id, contents, commments} = subject
    let $opinionpageelement = document.createElement('div')
    $opinionpageelement.classList.add('OpinionDisplay')
    $opinionpageelement.innerHTML=`
    <div class="opinionInput">
      <div class="OpinionSubject">${contents}</div>
        <form action="" class="form_input">
          <textarea
            name="content"
            id="content"
            cols="50"
            rows="6"
            placeholder="주제와 관련된 의견을 들려주세요"
            class="TextareaInput"
        ></textarea>
        <input type="submit" class="submit_btn" />
        </form>
      </div>
      <div class="lastOpinion">
        <h2 class="lastOpinionTitle">지난 의견</h2>
        <div class="OpinionCase">
          <div class="OpinionDate">22년 8월 22일</div>
          <div class="OpinionContent">지난 의견 2</div>
        </div>
        <div class="OpinionCase">
          <div class="OpinionDate">22년 8월 20일</div>
          <div class="OpinionContent">지난 의견 1</div>
        </div>
      </div>
    </div>
    `

    return $opinionpageelement
  }

  //Opinion page를 보여주어 조작 가능하게 만드는 함수
  const showOpinionpage = (subject)=>{
    $OpinionPage.innerHTML = ''
    $OpinionPage.classList.toggle('hidden',false)
    $OpinionPage.appendChild(createOpinionpageelement(subject))
    
  }

  const addcomment = async(e)=>{
    let targetClasses = Array.from(e.target.classList)
    if(targetClasses.includes('subject') || targetClasses.includes('subjectdisplay')){
      //잡히면, data set key를 받아서 서버에서 데이터를 id로 받아와서
      //Comment element를 만든 다음에
      //Opinion Page에 붙여주면 되겠는데.. 이때 Opinion page를 먼저 초기화해주고

      //Subject display의 데이터 id 받아오기
      let key = e.target.dataset.key
      //관련된 id의 subject를 받아오기(getSubject 함수 사용)
      let subject = await getSubject(key)
      //Opinionpage 보여주기
      showOpinionpage(subject)

    }
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getSubjects()
      pagination()
    })
    //주제 추가해줌
    $AddSubjectbtn.addEventListener('click', addSubject)

    //주제 삭제해주기
    $subjectlist.addEventListener('click', deletesubject)

    //주제 선택했을 때, 관련된 의견을 넣을 수 있도록 만들기
    $subjectlist.addEventListener('click',addcomment)

  }

  init()
})()