# remember
toy project 1. remember service

구체적인 내용은 Notion에 정리해보았습니다.
:https://kyubhinhan.notion.site/8-4-1-Remember-me-d90d885079e640049a5817142bc27346

## 목적
1. 살아가면서 생각이 변화하는데, 예전에 어떤 주제에 대해 어떤 생각을 했는지 기록해놓으면 재미있겠다 싶어서 한 번 만들어보기로 했다.

## 인원 : 1명

## 기간 : 2022.08.21 ~ 2022.08.27

## 기능
1. 날마다 어떤 주제가 뜬다.
2. 관련 주제에 대해서 적어 놓은 생각이 그 밑에 뜬다.
3. 생각이 어떻게 변화했는지 체크해 볼 수 있다.

## 구현의 구체적인 방법
1. 각자가 기록해보고 싶은 주제가 있으면 주제를 추가할 수 있다.
2. 일단 웹 페이지에 접근하였을 때, Default로 주제가 10가지 정도 구현해 놓은 상태이다.
3. 10개 중에서 랜덤하게 하나가 뜨고, 그에 대한 이전 대답이 있다면 이전 대답이 뜨도록 만든다.
4. 이전 대답은 가장 최신부터 옛날까지 보이게 된다.

## 페이지 레이아웃
### 메인 페이지
<img src="https://boulder-barracuda-0b4.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F988fcf6d-c96f-46be-a3dd-73fec223c5a2%2FUntitled.png?id=52e79159-f297-4586-ac31-bd96615784ff&table=block&spaceId=5ec80321-9655-4474-bb57-baa06d552303&width=2000&userId=&cache=v2" style="height: 300px; width:300px" />

### 주제 삭제 부분
<img src="https://boulder-barracuda-0b4.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F1d2614d0-60dd-4561-8058-ad77716ae625%2FUntitled.png?id=b2c68f8c-37a1-4c79-81f6-f1305453876a&table=block&spaceId=5ec80321-9655-4474-bb57-baa06d552303&width=2000&userId=&cache=v2" style="height: 300px; width:300px" />

### 주제 추가 부분
<img src="https://boulder-barracuda-0b4.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0cb11074-8755-4b45-bc4d-ba79fa07bedc%2FUntitled.png?id=ed26ca48-f5e6-4fdc-9e87-19d3f134f743&table=block&spaceId=5ec80321-9655-4474-bb57-baa06d552303&width=2000&userId=&cache=v2" style="height: 300px; width:300px" />

### 의견 작성 페이지 진입
<img src="https://boulder-barracuda-0b4.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F211f5847-4ae7-4419-bdb8-eeef322b834f%2FUntitled.png?id=a6c362e1-8d2e-4bf3-ac9f-bf73db78dd53&table=block&spaceId=5ec80321-9655-4474-bb57-baa06d552303&width=2000&userId=&cache=v2" style="height: 300px; width:300px" />

### 의견 작성 페이지 구성
<img src="https://boulder-barracuda-0b4.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8acce05d-ef46-4914-a7df-70e5356ea7e4%2FUntitled.png?id=24c44301-c4ac-4a65-9aea-118f059947ba&table=block&spaceId=5ec80321-9655-4474-bb57-baa06d552303&width=2000&userId=&cache=v2" style="height: 300px; width:300px" />
