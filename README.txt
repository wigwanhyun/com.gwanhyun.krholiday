한국 공휴일 확인해주는 앱
# Korean Holiday (한국 공휴일)

This app allows you to check if today is a public holiday in South Korea.
It is useful for automating flows such as turning off alarms or heating systems on holidays.

### Features
* **Flow Condition**: "It is (not) a Korean Public Holiday"
* **Real-time Data**: Uses official data from the public data portal (data.go.kr).
* **Smart Caching**: Minimizes API calls by caching monthly data.

### Setup Instructions
1.  Get an API Key (Decoding Key) from [data.go.kr](https://www.data.go.kr/data/15012687/openapi.do).
    * Search for "특일 정보" (Special Date Info) and request usage.
2.  Install this app on your Homey.
3.  Go to **Settings > Apps > Korean Holiday > App Settings**.
4.  Enter your **Service Key** and save.

### Example Flow
**WHEN** Time is 06:00
**AND** It is a weekday
**AND** It is **NOT** a Korean Public Holiday
**THEN** Turn on the electric blanket

---

# 한국 공휴일 (Korean Holiday)

이 앱은 오늘이 대한민국의 법정 공휴일인지 확인해줍니다.
공휴일에 기상 알람을 끄거나 난방 스케줄을 조정하는 등 다양한 자동화에 활용할 수 있습니다.

### 주요 기능
* **Flow 조건 카드**: "오늘이 한국 공휴일이라면 (또는 아니라면)"
* **실시간 데이터**: 공공데이터포털(data.go.kr)의 특일 정보 API를 사용합니다.
* **스마트 캐싱**: 월별 데이터를 저장하여 API 호출을 최소화합니다.

### 설정 방법
1.  [공공데이터포털](https://www.data.go.kr/data/15012687/openapi.do)에서 '한국천문연구원_특일 정보' 활용 신청을 합니다.
2.  **일반 인증키(Encoding)**를 발급받습니다.
3.  Homey 앱 내 **설정 > 앱 > 한국 공휴일 > 앱 설정**으로 이동합니다.
4.  발급받은 키를 입력하고 저장합니다.

### Flow 활용 예시
**언제**: 오전 6시가 되었을 때
**그리고**: 평일(월~금) 이면서
**그리고**: 오늘이 한국 공휴일이 **아니라면**
**그러면**: 전기장판 켜기